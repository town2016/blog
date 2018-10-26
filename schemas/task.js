const mongoose = require('mongoose')
const Schema = mongoose.Schema
module.exports = new Schema({
  taskName: String,
  hour: Number,
  minute: Number,
  content: String,
  userId: String,
  email: String
})
