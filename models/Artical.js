const mongoose = require('mongoose')
const articalSchema = require('../schemas/artical')
module.exports = mongoose.model('Artical', articalSchema)
