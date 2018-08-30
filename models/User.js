const mongoose = require('mongoose')
const userSchema = require('../schemas/users')
const User = mongoose.model('User', userSchema)
module.exports User
