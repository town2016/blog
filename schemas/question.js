const mongoose = require('mongoose')
let Schema = mongoose.Schema

let questionSchema = new Schema({
  question: String,
  answer: String
})

module.exports questionSchema
