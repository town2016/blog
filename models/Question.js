const mongoose = require('mongoose')
const questionSchema = require('../schemas/question')
const Question = mongoose.model('Question', questionSchema)
module.exports Question
