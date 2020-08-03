const mongoose = require('mongoose')
const MSchema = mongoose.Schema;

//this will create a mongoose schema on mogno db
const userSchema = new MSchema({
  
    name: String,
    age: Number,
    profession: String
})
module.exports = mongoose.model('User', userSchema)