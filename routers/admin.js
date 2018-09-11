const express = require('express')
const router = express.Router()
// 定义统一返回数据格式
let response
router.use(function (req, res, next) {
  response = {
    code: 200,
    message: ''
  }
  next()
})

router.get('/', function (req, res, next) {
  res.render('admin/index', {})
})

router.get('/category', function (req, res, next) {
  res.render('admin/category', {})
})
module.exports = router
