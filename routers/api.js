const express = require('express')
const router = express.Router()
const Question = require('../models/Question')
const ClientIP = require('../models/ClientIP')
const Email = require('../models/Email')
const Praise = require('../models/Praise')
const Statistics = require('../models/Statistics')
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
  var limit = Number(req.body.pageSize),skip = (Number(req.body.pageNum) - 1) * limit;
  Email.countDocuments({}, function (er, count) {
    if (er) {
      console.log(er)
    } else {
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

