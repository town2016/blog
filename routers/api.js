const express = require('express')
const router = express.Router()
const Question = require('../models/Question')
// 定义统一返回数据格式
let response
router.use(function (req, res, next) {
  response = {
    code: 200,
    message: ''
  }
  next()
})
router.post('/question', function (req, res, next) {
  let question = new Question(req.body)
  question.save().then( function (user) {
    response.message = '操作成功'
    res.json(response)
  })
})
router.get('/question', function(req, res, next) {
  Question.find({123:12312}).then(function (list) {
    console.log(err)
    if (err) {
      response.message = err
      res.json(response)
    } else {
      response.data = list
      res.json(response)
    }
  })
})
module.exports = router
