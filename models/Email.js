const mongoose = require('mongoose')
const emailSchema = require('../schemas/email')
const Email = mongoose.model('Email', emailSchema)
module.exports = Email
