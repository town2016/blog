const express = require('express')
const router = express.Router()
const Question = require('../models/Question')
const ClientIP = require('../models/ClientIP')
const axios = require('axios')
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
  let question = new Question(req.body)
  question.save().then( function (user) {
    response.message = '操作成功'
    res.json(response)
  })
})
/*
 拉取问题列表
 limit 每页返回天数
 skip 从第几条开始查询
 * */
router.get('/question', function(req, res, next) {
  Question.find().limit(5).skip(0).then(function (list) {
    if (err) {
      response.message = err
      res.json(response)
    } else {
      response.data = list
      res.json(response)
    }
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


module.exports = router
