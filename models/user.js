const mongoose = require("../config/connection");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneno: {
    type: String,
    required: true,
  },
  files: {
    type: [String],  
    required: true,
  },
});

const User = mongoose.model("User", userSchema,'users');

module.exports = User;
