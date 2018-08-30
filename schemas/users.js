const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  useName: String,
  password: String
})

module.exports userSchema
