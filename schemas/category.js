const mongoose = require('mongoose')
const Schema = mongoose.Schema
module.exports = new Schema({
  categoryName: String,
  categoryCode: String,
  updateTime: Date,
  createTime: Date,
  count: Number
})
