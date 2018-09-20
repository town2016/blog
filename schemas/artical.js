const mongoose = require('mongoose')
const Schema = mongoose.Schema
module.exports = new Schema({
  title: String,
  summary: String,
  category: String,
  content: String,
  createTime: Date,
  updateTime: Date,
  auther: String
})
