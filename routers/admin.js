const express = require('express')
const router = express.Router()
const md5 = require('js-md5')
const Category = require('../models/Category')
const Record = require('../models/ClientIP')
const Artical = require('../models/Artical')
const User = require('../models/User')
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
// 渲染邮件记录页
router.get('/emailRecords', function (req, res, next) {
  res.render('admin/email')
})
// 渲染编辑页
router.get('/emailEdit', function (req, res, next) {
  res.render('admin/emailEdit')
})
// 登录
router.get('/login', function (req, res, next) {
  res.render('admin/login')
})
// 用户管理
router.get('/users', function (req, res, next) {
  res.render('admin/users')
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
// 拉取文章列表
router.get('/articals', function (req, res, next) {
  var limit = Number(req.query.pageSize || 5), skip = Number(req.query.pageNum || 1)
  Artical.countDocuments({}, function (err, count) {
    if (err) {
      console.log(err)
    } else {
      Artical.find().limit(limit).skip((skip - 1) * limit).then(articals => {
        response.data = {}
        response.data.total = count
        response.data.list = articals
        res.json(response)
      })  
    }
  })
})
// 文章编辑保存
router.post('/saveArtical', function (req, res, next) {
  var params = req.body
  if (params._id) {
    Artical.findById(params._id, function (err, artical) {
      if (err) {
        console.log(err)
      } else {
        var data = params
        delete data._id
        data.updateTime = new Date()
        artical.update(data, function (err, row) {
          if (err) {
            response.code = 500
            response.data = err
            response.message = '操作失败'
          } else {
            response.message = '操作成功'
          }
          res.json(response)
        })
      }
    })
  } else {
    params.createTime = params.updateTime = new Date()
    params.auther = 'town'
    var artical = new Artical(params)
    artical.save(function (err, arti) {
      if (err) {
        response.code = 500
        response.message = '操作失败'
        response.data = err
        res.json(response)
      } else {
        response.message = '操作成功'
        Artical.countDocuments({category: params.category}, function (countErr, count) {
          if (countErr) {
            console.log(countErr)
          } else {
            Category.findOne({categoryCode: params.category}, function (cateErr, cate) {
              if (cateErr) {
                console.log(cateErr)
              } else {
                cate.update({count: count, updateTime: new Date()}, function (categoryErr, row) {
                  if (categoryErr) {
                    console.log(err)
                  } else {
                    res.json(response)
                  }
                })
              }
            }) 
          }
        })
      }
    })
  }
})

// 文章删除
router.get('/deleteArtical', function (req, res, next) {
  var $ids = req.query.id.split(',')
  var category = req.query.category
  Artical.remove({_id: { $in: $ids}}, function (err) {
    if (err) {
      response.code = 500
      response.message = '操作失败'
      response.data = err
    } else {
      response.message = '操作成功'
      Artical.countDocuments({category: category}, function (countErr, count) {
          if (countErr) {
            console.log(countErr)
          } else {
            Category.findOne({categoryCode: category}, function (cateErr, cate) {
              if (cateErr) {
                console.log(cateErr)
              } else {
                cate.update({count: count, updateTime: new Date()}, function (categoryErr, row) {
                  if (categoryErr) {
                    console.log(err)
                  }
                })
              }
            }) 
          }
        })
    }
    res.json(response)
  })
})
// 文章详情
router.get('/detailArtical/:id', function (req, res, next) {
  Artical.findById({_id: req.params.id}, function (err, row) {
    if (err) {
      response.code = 500
      response.message = '操作失败'
      response.data = err
    } else {
      response.data = row
    }
    res.json(response)
  })
})

// 文章图片上传
router.post('/fileUpload',  upload.single("file"), function (req, res, next) {
     var tmp_path = req.file.path;
     
    // 指定文件上传后的目录 - 示例为"images"目录。 
    var target_path = './uploads/' + req.file.originalname;
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
      // 删除临时文件夹文件, 
      fs.unlink(tmp_path, function() {
         if (err) throw err;
         response.data = '/uploads/' + req.file.originalname
         res.json(response)
      });
    });
})

// 用户列表
router.get('/userList', function (req, res, next) {
  var query = req.query || {}
  User.find(query, function (err, rows) {
    if (err) {
      console.log(err)
    } else {
      response.data = rows
      res.json(response)
    }
  })
})
// 新增用户
router.post('/userSave', function (req, res, next) {
  var params = req.body
  params.pwd = md5(params.pwd)
  var user = new User(params)
  user.save().then(function (row) {
    console.log(arguments)
    if (row) {
      response.message = '操作成功'
    } else {
      response.code = 500
      response.message = '操作失败'
      response.data = row
    }
    res.json(response)
  })
})
// 删除用户
router.get('/userDelete', function (req, res, next) {
  User.deleteOne({_id: req.query.id}).then(function (docs) {
    if (docs) {
      response.message = '操作成功'
    } else {
      response.code = 500
      response.message = '操作失败'
      response.data = row
    }
    res.json(response)
  })
})
// 用户登录
router.post('/login', function (req, res, next) {
  var params = req.body
  User.find(params).then(function (docs) {
    if (docs.length === 0) {
      response.code = 500
      response.message = '用户名或者密码错误'
      response.data = docs
    } else {
      req.cookies.set('userInfo', JSON.stringify(docs[0]))
      response.message = '操作成功'
    }
    res.json(response)
  })
})
module.exports = router