const express = require("express");
const session = require("express-session");
const app = express();
const studentRoutes = require('./routes/student');
const userRoutes = require("./routes/user");
const jwt = require("./middlewares/authMiddleware")
const auth = require("./routes/authStudent")
const studentfeRoutes =require ("./routes/studentJquery")
const cors = require('cors');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: "NJSDJH23526NJSJN256JWIU",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
    },
  })
);

app.use("/uploads", express.static("uploads"));

app.set("view engine", "ejs");

app.use("/",auth);
app.use("/user", userRoutes);
app.use('/students',jwt.verifyToken,studentRoutes);
// app.use('/studentsJquery',jwt.verifyToken,studentfeRoutes); 
app.use('/studentsJquery',studentfeRoutes); 




app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
