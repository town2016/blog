const express = require('express')
const router = express.Router()
const Question = require('../models/Question')
const ClientIP = require('../models/ClientIP')
const Email = require('../models/Email')
const Praise = require('../models/Praise')
const Statistics = require('../models/Statistics')
const Task = require('../models/Task')
const axios = require('axios')
const nodemailer = require('nodemailer')
const schedule = require('node-schedule')
const scheduleMap = {}
var mailTransport = nodemailer.createTransport({
    host : 'smtp.sina.com',
    secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
    auth : {
        user : 'nanfang528@sina.com',
        pass : '13538224239'
    }
});
// 定义统一返回数据格式
let response
router.use(function (req, res, next) {
  response = {
    code: 200,
    message: ''
  }
  next()
})

// 提交问题
router.post('/question', function (req, res, next) {
  let params = req.body
  params.createTime = params.updateTime = new Date()
  params.answer = ''
  let question = new Question(params)
  question.save().then( function (user) {
    response.message = '操作成功'
    res.json(response)
  })
})
// 问答编辑
router.post('/editQuestion', function (req, res, next) {
  let params = req.body
  Question.findById(params._id, function (err, question) {
    if (err) {
      console.log(err)
    } else {
      question.update({
        answer: params.answer,
        updateTime: new Date()
      }, function (error, row) {
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
})
// 拉取问答详情
router.get('/detailQuestion', function (req, res, next) {
  Question.findById(req.query.id, function (err, question) {
    if (err) {
      response.code = 500
      response.data = err
    } else {
      response.data = question
    }
    res.json(response)
  })
})
/*
 拉取问题列表
 limit 每页返回天数
 skip 从第几条开始查询
 * */
router.get('/question', function(req, res, next) {
  var limit = Number(req.query.pageSize || 10), skip = Number(req.query.pageNum || 1)
  Question.countDocuments({}, function (err, count) {
    if (err) {
      console.log(err)
    } else {
      Question.find().limit(limit).skip(limit * (skip - 1)).then(function (list) {
        if (list) {
          response.data = {}
          response.data.total = count
          response.data.list = list
          res.json(response)
        } else {
          response.data = list
          res.json(response)
        }
      })
    }
  })
})
/*
 *删除问答
 * */
router.get('/deleteQuestion', function (req, res, next) {
  console.log(req.query.id)
  Question.remove({_id: req.query.id}, function (err) {
    if (err) {
      response.code = 500
      response.data = err
      response.message = '操作失败'
    } else {
      response.message = '操作成功'
    }
    res.json(response)
  })
})
const  query = {
"req_0":{
"module":"vkey.GetVkeyServer",
"method":"CgiGetVkey",
"param":{
  "guid":"4016650250",
  "songmid":["002ZKnKQ34rbZu","001G5IgY2gHy1T","002ihFxm1EarI4","003vebij0oHGXE","000Ih2kc2fBXPT","000nabdy2vrA0S","004aStGo17PsB2","0018YBhh2vDLzQ","001FPOIM20siE6","001tNpVH2WfcN0","004btPxv0CSo8q","0049WGCk10fTUK","000vEse41c28Rt"],
  "songtype":[],
  "uin":"0",
  "loginflag":0,
  "platform":"23"
  }
},
"comm":{
  "g_tk":5381,
  "uin":0,
  "format":"json",
  "ct":23,
  "cv":0}
}

// 从QQ音乐拉取歌曲列表
router.get('/songList', function (req, res, next) {
  let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?_=1535905775943'
  axios.post(url, query, 
    {
     headers: {
       referer: 'https://u.y.qq.com/',
       host: 'u.y.qq.com'
     }
    }
  ).then(response => {
    res.json(response.data)
  }).catch(e => {
    console.log(e)
  })
})

// 获取客户端IP
function getClientIp (req) {
    var ipAddress;
    var forwardIpStr = req.headers['x-forwarded-for'];
    if (forwardIpStr) {
        var forwardIp = forwardIpStr.split(',');
        ipAddress = forwardIp[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAdress;
    }
    if (!ipAddress) {
        ipAddress = req.socket.remoteAdress;
    }
    if (!ipAddress) {
        if (req.connection.socket) {
          console.log(1)
            ipAddress = req.connection.socket.remoteAdress;
        }
        else if (req.headers['remote_addr']) {
            ipAddress = req.headers['remote_addr'];
        }
        else if (req.headers['client_ip']) {
            ipAddress = req.headers['client_ip'];
        }
        else {
            ipAddress = req.ip;
        }

    }
    return ipAddress;
}

// 记录浏览次数
router.post('/visit', function (req, res, next) {
  let ip = getClientIp(req).split("::ffff:")[1]
  ClientIP.findOne({ip:ip}, function (err, record) {
    if (record) {
      record.update({updateTime: new Date(), count: record.count*1 + 1}, function (err, data) {
        if (err) {
          response.message = err
        } else {
          response.message = '操作成功'
        }
        res.json(response)
      })
    } else {
      clientIp = new ClientIP({
        ip: ip,
        count: 1,
        createTime: new Date(),
        updateTime: new Date()
      })
      clientIp.save().then(function (clinetIp) {
        response.message = '操作成功'
        res.json(response)
      })
    }
    Statistics.find({}, function (err, docs) {
      if (docs.length > 1) {
        var visitNum = docs[0].visit + 1
        docs[0].update({visit: visitNum}, function (err, sta) {
          if (err) {
            console.log(err)
          }
        })
      }
    })
  })
})

// 邮件发送
router.post('/mailto', function (req, res, next) {
  var params = {
    from: 'nanfang528@sina.com',
    to: req.body.to ? req.body.to : '1026032608@qq.com'
  }
  params = Object.assign({}, req.body, params)
  mailTransport.sendMail(params, function(err, msg){
    if(err){
      console.log(err);
      response.code = 500
      response.data = err
      res.json(response)
    }else {
      if (req.body._id) {
        Email.updateOne({_id: req.body._id}, {status: 2, reply: req.body.reply}, function (uErr) {
          if (uErr) {
            console.log(uErr)
            response.data = uErr
            response.message = '操作失败'
          } else {
            response.message = '操作成功'
          }
          res.json(response)
        })
        return
      }
      var _email = {
        from: params.from,
        to: params.to,
        createTime: new Date(),
        addressee: req.body.addressee || 'town',
        sender: req.body.nickName,
        status: 1,
        senderEmail: params.senderEmail,
        subject: params.subject,
        content: params.html
      }
      let email = new Email(_email)
      email.save(function (err, row) {
        if (err) {
          console.log(err)
          response.data = err
          response.message = '邮件保存失败'
        } else {
          response.message = '邮件发送成功'
        }
        res.json(response)
      })
    }
    Statistics.find({}, function (err, docs) {
      if (docs.length > 1) {
        var emailNum = docs[0].email + 1
        docs[0].update({email: emailNum}, function (err, sta) {
          if (err) {
            console.log(err)
          }
        })
      }
    })
  })
})
// 邮件列表
router.get('/emailList', function (req, res, next) {
  var limit = Number(req.query.pageSize),skip = (Number(req.query.pageNum) - 1) * limit;
  Email.countDocuments({}, function (er, count) {
    if (er) {
      console.log(er)
    } else {
      console.log(limit)
      Email.find({}).sort({createTime: '-1'}).limit(limit).skip(skip).exec(function (err, emails) {
        if (err) {
          response.code = 500
          response.data = err
        } else {
          response.data = {}
          response.data.list = emails
          response.data.total = count
        }
        res.json(response)
      })
    }
  })
})

// 邮件删除
router.get('/deleteEmail', function (req, res, next) {
  Email.remove({_id: req.query.id}, function (err) {
    if (err) {
      response.code = 500
      response.message = '操作失败'
    } else {
      response.message = '操作成功'
    }
    res.json(response)
  })
})
// 获取邮件详情
router.get('/detailEmail/:id', function (req, res, next) {
  Email.findById(req.params.id, function (err, email) {
    if (err) {
      console.log(err)
      response.code = 500
      response.data = err
    } else {
      response.data = email
    }
    res.json(response)
  })
})

module.exports = router

// 点赞
router.post('/praise', function (req, res, next) {
  var articalId = req.body.articalId
  Praise.findOne({articalId: articalId}, function (err, praise) {
    if (praise) {
      var count = praise.count++
      praise.update({count: count}, function (err, doc) {
        if (err) {
          console.log(err)
        } else {
          response.message = '点赞成功,谢谢您对作者的支持'
          res.json(response)
          Statistics.find({}, function (err, docs) {
            if (docs.length > 1) {
              var praiseNum = docs[0].praise + 1
              docs[0].update({praise: praiseNum}, function (err, sta) {
                if (err) {
                  console.log(err)
                }
              })
            }
          })
        }
      })
    } else {
      var praise = new Praise({
        articalId: articalId,
        count: 1
      })
      praise.save(function (doc) {
        if (doc) {
          response.message = '点赞成功,谢谢您对作者的支持'
        } else {
          response.message = '网络繁忙，稍后重试'
        }
        res.json(response)
      })
    }
  })
})
// 创建定时任务
router.post('/createSchedule', function (req, res) {
  var params = req.body;
  var taskName = 'task_' + new Date().getTime();
  params.taskName = taskName
  createTask(params)
  var taskModel = new Task({
    taskName: params.taskName,
    hour: params.hour,
    minute: params.minute,
    content: params.content,
    email: params.email
  })
  taskModel.save().then((err, row) => {
    if (!err) {
      response.message = '任务设置失败',
      response.code = 500
    } else {
      response.message = '任务设置成功'
    }
    res.json(response)
  })
})

function createTask (params) {
  var hour = params.hour
  var minute = params.minute
  var rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [1, new schedule.Range(1, 5)];
  rule.hour = hour;
  rule.minute = minute;
  var html = `<div style='max-width: 600px;'>
                <h3>消息提醒</h3>
                <p>老板你好:</p>
                <div style='text-indent: 24px;width: 600px;'>
                  我是你的智能助理,现在是${hour > 10 ? hour : '0' + hour}点${minute > 10 ? minute : '0' + minute}分,你的行程安排为您呈上:<h4 style='color: red'>"${params.content}"</h4>
                </div>
                <p style='max-width: 600px;'>
                  <a href='http://blog.szinneractive.cn:8088/taskList'>设置更多任务?猛戳这里!!!</a>
                  <span>or</span>
                  <a href='http://blog.szinneractive.cn:8088/'>猛戳这里,有更多惊喜</a>
                </p>
                <div class='nav' style='line-height:30px;max-width: 600px;'>
                  <img src='http://blog.szinneractive.cn:8088/public/img/308921807767887092.jpg' height='20px' style='display:inline-block;vertical-align:middle;margin-right:5px;'/>
                  <span style='display:inline-block;vertical-align:middle'>该服务由<a href='http://www.szinneractive.cn/'>深圳互动深世界科技有限公司</a>提供</span>
                </div>
                <div style='text-align: right;max-width: 600px;'>发件人:您的私人助理</div>
              <div>`
  var task = schedule.scheduleJob(rule, function(){
    var url = 'http://blog.szinneractive.cn:8088/api/mailto'
　　axios.post(url, {
        senderEmail: params.email,
        nickName: '私人助理',
        html: html,
        subject: `消息提醒:${params.content.substr(0,10)}......`,
        to: params.email
    }).then(res => {}).catch(e => {
      console.log(e)
    })
  });
  scheduleMap[params.taskName] = task
}

//  拉取定时任务
router.get('/taskList', function (req, res) {
  var params = req.query || {}
  Task.find(params, function (err, docs) {
    if (err) return console.log(err)
    response.data = docs
    res.json(response)
  })
})
// 删除定时任务
router.get('/deleteTaskById', function (req, res) {
  var id = req.query.id
  Task.findById(id, function (err, row) {
    if (err) {
      response.message = '删除的记录不存在'
      response.code = 500
      res.json(response)
    } else {
      taskName = row.taskName
      Task.remove({_id: id}).then(function (doc) {
        if (!doc) {
          response.message = '删除失败'
          response.code = 500
        } else {
          response.message = '删除成功'
          scheduleMap[row.taskName].cancel()
          delete scheduleMap[row.taskName]
        }
        res.json(response)
      })
    }
  })
})
// 服务器重启时重新设置定时任务
Task.find({}, function (err, docs) {
  if (err) {
    console.log(err)
    return
  }
  docs.map(item => {
    createTask(item)
  })
})
