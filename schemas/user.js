const mongoose = require('mongoose')
const Schema = mongoose.Schema
module.exports = new Schema({
  account: String,
  pwd: String,
  role: String
})
