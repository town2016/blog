const mongoose = require('mongoose')
const Schema = mongoose.Schema

let emailSchema = new Schema({
  from: String, // 发件邮箱
  sender: String,// 发件人
  addressee: String, // 收件人
  to: String, // 收件邮箱
  senderEmail: String, // 发件人邮箱
  content: String, // 邮件信息
  subject: String, // 邮件主题
  status: Number, // 1为未读，2为已读,
  reply: String, // 回复
  createTime: Date
})
module.exports = emailSchema 