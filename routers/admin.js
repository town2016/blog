const express = require('express')
const router = express.Router()
const Category = require('../models/Category')
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

// 类别列表查询
router.get('/categorys', function (req, res, next) {
  Category.find().then(categorys => {
    response.data = categorys
    res.json(response)
  })
})

// 类别保存
router.post('/saveCategory', function (req, res, next) {
  let category = req.body
  if (category.id) {
    Category.findById(category.id, function (err, cate) {
      if (err) {
        console.log(err)
      } else {
        let params = {
          categoryName: category.categoryName,
          categoryCode: category.categoryCode,
          updateTime: new Date()
        }
        cate.update(params, function (err, row) {
          if (err) {
            response.code = 500
            response.message = '操作失败'
            console.log(err)
          } else {
            response.message = '操作成功'
          }
          res.json(response)
        })
      }
    })
  } else {
    // 判断记录是否存在
    Category.findOne({categoryName: category.categoryName}, function (err, cate) {
      if (cate) {
        response.code = 500
        response.message = '数据已存在'
        res.json(response)
      } else {
        // 新增
        category.createTime = category.updateTime = new Date()
        category.count = 0
        let cate = new Category(category)
        cate.save(function (err, row) {
          if (err) {
            response.code = 500
            response.message = '操作失败'
          } else {
            response.message = '操作成功',
            response.data = row
          }
          res.json(response)
        })
      }
    })
  }
})
// 删除
router.get('/deleteCategory', function (req, res, next) {
  let id = req.query.id
  Category.remove({_id: id}, function (err) {
    if (err) {
      response.code = 500
      response.message = '操作失败'
    } else {
      response.message = '操作成功'
    }
    res.json(response)
  })
})
