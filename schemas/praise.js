const mongoose = require('mongoose')
const Schema = mongoose.Schema
module.exports = new Schema({
  articalId: String,
  count: {
    type: Number,
    default () {
      return 0
    }
  }
})
