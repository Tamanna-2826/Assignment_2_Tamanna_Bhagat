// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const Student = require("../models/students");
const jwt = require("../middlewares/authMiddleware");

router.get('/login', (req, res) => {
  res.render('login_student');
});


router.post("/login", (req, res) => {
  const { email, password } = req.body;

  Student.findOne({ email, password })
    .then((student) => {
      if (!student) return res.status(404).send("Student Not Found !");
      const token = jwt.generateToken({ email, password });
      console.log("TOKEN : ", token);
      res.status(200).send(token);
      //res.status(200).send(token);
    })
    .catch((error) => {
      res.status(500).send("Error Login User : " + error);
    });
});

//Login Route for jQuery FE
router.post("/loginStudent", (req, res) => {
  const { email, password } = req.body;

  Student.findOne({ email, password })
    .then((student) => {
      if (!student) return res.status(404).send("Student Not Found !");
      const token = jwt.generateToken({ email, password });
      console.log("TOKEN : ", token);
      res.status(200).send(token);
    })
    .catch((error) => {
      res.status(500).send("Error Login User : " + error);
    });
});




module.exports = router;
