const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
  ip: String,
  createTime: Date,
  updateTime: Date,
  count: Number
})
