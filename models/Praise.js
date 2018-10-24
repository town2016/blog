const mongoose = require('mongoose')
const praiseSchema = require('../schemas/praise')
const Praise = mongoose.model('Praise', praiseSchema)
module.exports = Praise
