const express = require('express')
const swig = require('swig') // 加载模板引擎
const mongoose = require('mongoose') // 加载数据库操作模块
const bodyParser = require('body-parser') // 加载请求体的解析插件
const app = express()
global.db
// 设置模板路径
app.set('views', './views')
// 配置模板引擎，使用swig的renderFile方法来渲染后缀为html的文件
app.engine('html', swig.renderFile)
// 注册模板引擎
app.set('view engine', 'html')
// 清除模板引擎的缓存
swig.setDefaults({cache: false})
// 配置静态文件路径
app.use('/public', express.static(__dirname + '/public'))
// bodyParser配置
app.use(bodyParser.urlencoded({ extended: true }))
// 初始化并连接数据库
mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser:true}, function (err, mongo) {
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

app.use('/api', require('./routers/api'))
const blog_createTime = new Date('2018-08-08').getTime()
const Question = require('./models/Question')
const ClientIP = require('./models/ClientIP')
app.get('/', function (req, res, next) {
  Question.count({}, function (err, questionCount) {
    if (err) {
      console.log(err)
    } else {
      Question.find().limit(3).then(function (list) {
        ClientIP.find({}, function (err, views) {
          let count = 0
          if (err) {
            response.message = err
          } else {
            views.forEach(item => {
              count += item.count
            })
          }
          let responseData = {
            title: 'town-blog',
            questions: list,
            questionCount: questionCount,
            dateLength: Math.ceil((new Date().getTime() - blog_createTime) / 86400000),
            viewCount: count,
            nav: [
              {
                name: '首页',
                path: '/'
              }, {
                name: 'H5',
                path: '/h5',
                num: 18
              }, {
                name: 'CSS',
                path: '/css',
                num: 21
              }, {
                name: 'JS',
                path: '/native',
                num: 50
              }, {
                name: 'NODE',
                path: '/node',
                num: 22
              }
            ]
          }
          res.render('index', responseData)
        })
      })  
    }
  })
})
