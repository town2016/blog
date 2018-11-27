const express = require('express')
const swig = require('swig') // 加载模板引擎
const mongoose = require('mongoose') // 加载数据库操作模块
const bodyParser = require('body-parser') // 加载请求体的解析插件
const app = express()
const moment = require('./public/js/moment')
const qrImg = require('qr-image')
const Cookies = require('cookies')
global.db
// 设置模板路径
app.set('views', './views')
// 配置模板引擎，使用swig的renderFile方法来渲染后缀为html的文件
app.engine('html', swig.renderFile)
// 注册模板引擎
app.set('view engine', 'html')
// 清除模板引擎的缓存
swig.setDefaults({
  cache: false,
  filters: {
    timeFormat: function (val) {
      return 123
    }
  }
})

// 设置cookie中间件
app.use(function (req, res, next) {
  req.cookies = new Cookies(req, res)
  if (!req.cookies.get('userInfo')) {
    if (req.url.indexOf('/public') < 0 && req.url.indexOf('admin') >= 0 && req.url !== '/admin/login' && req.url .indexOf('/admin/articals') < 0) {
      return res.redirect('/admin/login')
    }
  }
  next()
})

// 配置静态文件路径
app.use('/public', express.static(__dirname + '/public'))
app.use('/uploads', express.static(__dirname + '/uploads'))
// bodyParser配置
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

// 初始化并连接数据库
mongoose.connect('mongodb://112.74.39.234:27017/blog', {useNewUrlParser:true}, function (err, mongo) {
  if (err) {
    console.log('数据库连接失败')
  } else {
    mongoose.connection.db.collections().then(res => {
      db = res
    })
    console.log('数据库连接成功')
    app.listen(8088, function () {
      console.log('服务已启动')
    })
  }
})




mongoose.Promise = global.Promise
// 路由模块化
app.use('/api', require('./routers/api'))
app.use('/admin', require('./routers/admin'))
// 首页渲染所需要的模块
const blog_createTime = new Date('2018-08-08').getTime()
const Question = require('./models/Question')
const ClientIP = require('./models/ClientIP')
const Category = require('./models/Category')
const Artical = require('./models/Artical')
const Email = require('./models/Email')
const Statistics = require('./models/Statistics')
// 渲染首页
app.get('/', function (req, res, next) {
    Question.find().limit(3).then(function (list) {
      Statistics.find({}, function (err, statistics) {
        var statistic = statistics[0]
        let count = 0
        if (err) {
          console.log(err)
        }
        // 分类列表
        Category.find({}, function (err, categorys) {
          let responseData = {
            title: '个人博客__town',
            questions: list,
            emails: statistic.email,
            praises: statistic.praise,
            dateLength: Math.ceil((new Date().getTime() - blog_createTime) / 86400000),
            viewCount: statistic.visit,
            nav: [
              {
                name: '首页',
                path: '/'
              }
            ]
          }
          categorys.forEach(item => {
            responseData.nav.push({
              name: item.categoryName,
              path: `/${item.categoryCode}`,
              num: item.count
            })
          })
          
          // 文章列表
          Artical.find({}).sort({'updateTime': -1}).limit(3).exec(function (err, articals) {
            if (err) {
              console.log(err)
            } else {
              responseData.articals = articals
              res.render('index', responseData)
            }
          })
          
        })
      })
    }) 
})

// 渲染文章详情页
app.get('/artical/:id', function (req, res, next) {
  Statistics.find({}, function (err, statistics) {
    var statistic = statistics[0]
    let count = 0
    if (err) {
      console.log(err)
    }
    Category.find({}, function (err, categorys) {
      let responseData = {
        title: '个人博客__town',
        emails: statistic.email,
        praises: statistic.praise,
        dateLength: Math.ceil((new Date().getTime() - blog_createTime) / 86400000),
        viewCount: statistic.visit,
        nav: [
          {
            name: '首页',
            path: '/'
          }
        ]
      }
      categorys.forEach(item => {
        responseData.nav.push({
          name: item.categoryName,
          path: `/${item.categoryCode}`,
          num: item.count
        })
      })
      var id = req.params.id
      Artical.findById(id, function (err, artical) {
        responseData.artical = {}
        if (err) {
          responseData.artical.content = '未找到该文章，请确认文章是否存在'
        } else {
          responseData.artical = artical
        }
        res.render('artical', responseData)
      })
    })
  })
})
// 渲染文章详情页
app.get('/artical_m/:id', function (req, res, next) {
  var id = req.params.id, responseData = {};
  Artical.findById(id, function (err, artical) {
    responseData.artical = {}
    if (err) {
      responseData.artical.content = '未找到该文章，请确认文章是否存在'
    } else {
      responseData.artical = artical
    }
    res.render('artical_m', responseData)
  })
})

// 文章列表页
app.get('/articalList/:category', function (req, res, next) {
  Statistics.find({}, function (err, statistics) {
    var statistic = statistics[0]
    let count = 0
    if (err) {
      console.log(err)
    }
    Category.find({}, function (err, categorys) {
      let responseData = {
        title: '个人博客__town',
        emails: statistic.email,
        praises: statistic.praise,
        dateLength: Math.ceil((new Date().getTime() - blog_createTime) / 86400000),
        viewCount: statistic.visit,
        nav: [
          {
            name: '首页',
            path: '/'
          }
        ]
      }
      categorys.forEach(item => {
        responseData.nav.push({
          name: item.categoryName,
          path: `/${item.categoryCode}`,
          num: item.count
        })
      })
      var query = req.params.category === 'all' ? {} : {category: req.params.category}
      Artical.find(query).sort({'updateTime': -1}).limit(15).exec(function (err, articals) {
        if (err) {
          console.log(err)
        } else {
          responseData.articals = articals || []
          res.render('articalList', responseData)
        }
      })
    })
  })
})

// 二维码生成
app.get("/qrcode", function (req, res, next) {
    const qrcode = qrImg.image('http://'+req.headers.host + req.query.link, {
        ec_level: '30%',
        margin: 1
    });
    res.type("png");
    qrcode.pipe(res);
});

// 定时任务页
app.get('/taskList', function (req, res) {
  res.render('taskList', {})
})
