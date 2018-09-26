const express = require('express')
const router = express.Router()
const Question = require('../models/Question')
const ClientIP = require('../models/ClientIP')
const axios = require('axios')
const nodemailer = require('nodemailer')
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
  })
})

// 邮件发送
router.post('/mailto', function (req, res, next) {
  var params = {
    from: 'nanfang528@sina.com',
    to: '"1026032608@qq.com',
    subject : '一封来自Node Mailer的邮件',
    text: '一封来自Node Mailer的邮件',
    html: '<h1>你好，这是一封来自NodeMailer的邮件！</h1>
  }
  mailTransport.sendMail(options, function(err, msg){
    if(err){
        console.log(err);
        res.render('index', { title: err });
    }
    else {
        console.log(msg);
    }
  })
  
})

module.exports = router
