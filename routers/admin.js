const express = require('express')
const router = express.Router()
const Category = require('../models/Category')
const Record = require('../models/ClientIP')
var app = express()
var fs = require('fs')
var multer = require('multer')
var upload = multer({dest:'./uploads'})
// 定义统一返回数据格式
let response
router.use(function (req, res, next) {
  response = {
    code: 200,
    message: ''
  }
  next()
})

// 渲染后台管理系统首页
router.get('/', function (req, res, next) {
  res.render('admin/index')
})
// 渲染分类页
router.get('/category', function (req, res, next) {
  res.render('admin/category')
})
// 渲染问答页
router.get('/question', function (req, res, next) {
  res.render('admin/question')
})
// 渲染浏览记录页
router.get('/browseRecords', function (req, res, next) {
  res.render('admin/browseRecords')
})

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
  if (category._id) {
    Category.findById(category._id, function (err, cate) {
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
// 删除分类
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
// 拉取分类详情
router.get('/detailCategory/:id', function (req, res, next) {
  let id = req.params.id
  Category.findById(id, function (err, cate) {
    if (err) {
      response.code = 500
      response.data = err
    } else {
      response.data = cate
    }
    res.json(response)
  })
})
// 查询所有浏览记录
router.get('/browseRecordList', function (req, res, next) {
  Record.countDocuments({}, function (err, count) {
    if (!err) {
      var limit = Number(req.query.pageSize), skip = (req.query.pageNum - 1) * limit;
      Record.find().limit(limit).skip(skip).then(function (doc) {
        response.data = {}
        response.data.total = count
        response.data.list = doc
        res.json(response)
      })
    } else {
      response.code = 500
      response.data = err
      res.json(response)
    }
  })
})

// 文章管理
router.get('/artical', function (req, res, next) {
  res.render('admin/artical')
})
// 文章编辑页面
router.get('/articalAdd', function (req, res, next) {
  res.render('admin/articalAdd')
}) 
// 文章图片上传
router.post('/fileUpload',  upload.single("file"), function (req, res, next) {
    // var files =  req.files.thumbnail
     var tmp_path = req.file.path;
    // 指定文件上传后的目录 - 示例为"images"目录。 
    var target_path = './uploads' + req.file.originalname;
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
      // 删除临时文件夹文件, 
      fs.unlink(tmp_path, function() {
         if (err) throw err;
         response.data = target_path
         res.json(response)
      });
    });
   //  

})


module.exports = router