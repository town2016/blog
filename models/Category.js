const mongoose = require('mongoose')
const CategorySchema = require('../schemas/category')
module.exports = mongoose.model('Category', CategorySchema)
