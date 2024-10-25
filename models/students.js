// models/student.js
const mongoose = require('../config/connection');

const studentSchema = new mongoose.Schema({
    name: String,
    email:String,
    password:String,
    age: Number,
    gender:String,
    sem:Number,
    div: String,
    dob:Date
});

module.exports = mongoose.model('Student', studentSchema,'students');
