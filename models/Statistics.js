const mongoose = require('mongoose')
const statisticsSchema = require('../schemas/statistics')
const Statictics = mongoose.model('Statistics', statisticsSchema)
module.exports = Statictics
