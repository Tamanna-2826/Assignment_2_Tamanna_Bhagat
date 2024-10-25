const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/Assignment1_DB")
const db = mongoose.connection;
db.on('open',()=>{
    console.log("Connected to MongoDB")
})

module.exports = mongoose;
