const express = require("express");
const { body, validationResult } = require("express-validator");

const multer = require("multer");
const User = require("../models/user");
const router = express.Router();
const path = require("path");
const fs = require('fs')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/register", (req, res) => {
  res.render("register_user");
});

router.post(
  "/register",
  upload.array("files"),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("phoneno")
      .isNumeric()
      .withMessage("Phone number must be numeric")
      .isLength({ min: 10, max: 15 })
      .withMessage("Phone number must be between 10 to 15 digits"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("register_user", { errors: errors.array() });
    }
    const { name, email, password, phoneno } = req.body;

    const fileNames = req.files.map((file) => file.filename);

    const user = new User({
      name: name,
      email: email,
      password: password,
      phoneno: phoneno,
      files: fileNames,
    });
    user
      .save()
      .then((user) => {
        // res.status(200).send(user)
        res.redirect("/user/files");
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  }
);
router.get("/login", (req, res) => {
  res.render("login_user");
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    User.findOne({ email, password }) 
      .then(user => {
        if (!user) {
          return res.status(401).render('login_user', { error: 'Invalid email or password' });
        }
  
        req.session.userId = user._id;
        req.session.userName = user.name;
  
        res.redirect('/user/profile');
      })
      .catch(error => {
        res.status(500).send(error);
      });
  });
  
  router.get('/profile', (req, res) => {
    res.set('Cache-Control', 'no-store'); 

    if (!req.session.userId) {
      return res.redirect('/user/login'); 
    }
    User.findById(req.session.userId)
    .then(user => {
      if (!user) {
        return res.status(404).send('User not found');
      }

      res.render('user_profile', { user }); 
    })
    .catch(error => {
      res.status(500).send(error);
    });
})


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Could not log out');
      }
      res.clearCookie('connect.sid'); 
  
      res.redirect('/user/login'); 
    });
  });

router.get("/files", (req, res) => {
  const users = User.find({})
    .then((users) => {
      // res.status(200).send(users)
      res.render("files", { users });
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

router.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }

    res.download(filePath, (err) => {
      if (err) {
        res.status(500).send('Error downloading the file');
      }
    });
  });
});

module.exports = router;
