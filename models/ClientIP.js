const mongoose = require('mongoose')
const clientip = require('../schemas/clientIP')
module.exports = mongoose.model('ClientIP', clientip)
