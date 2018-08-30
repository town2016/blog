const express = require('express')
const swig = require('swig') // 加载模板引擎
const mongoose = require('mongoose') // 加载数据库操作模块
const app = express()
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
// 初始化并连接数据库
mongoose.connect('mongodb://localhost:27017/blog', function (err) {
  if (err) {
    console.log('数据库连接失败')
  } else {
    console.log('数据库连接成功')
    app.listen(8088, function () {
      console.log('服务已启动')
    })
  }
})
app.get('/', function (req, res, next) {
  res.render('index', {
    title: 'town-blog',
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
  })
})
