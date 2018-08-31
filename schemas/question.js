const mongoose = require('mongoose')
let Schema = mongoose.Schema

let questionSchema = new Schema({
  question: String,
  answer: String,
  category: String,
  description: String
})

module.exports = questionSchema
