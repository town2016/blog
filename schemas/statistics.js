const mongoose = require('mongoose')
const Schema = mongoose.Schema
module.exports = new Schema({
  visit: Number,
  email: Number,
  praise: Number
})
