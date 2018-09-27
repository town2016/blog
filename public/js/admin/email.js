const tableModel = [{
  label: '邮件主题',
  prop: 'subject',
  width: 120
}, {
  label: '发件人',
  prop: 'sender'
}, {
  label: '收件人',
  prop: 'addressee'
}, {
  label: '发件邮箱',
  prop: 'from'
}, {
  label: '收件邮箱',
  prop: 'to'
}, {
  label: '状态',
  prop: 'status',
  formatter: function (h, row) {
    var status = h('span', {}, row.status === 1 ? '未读' : '已读')
    if (row.status === 2) {
      status.style.color = '#67c23a'
    } else {
      status.style.color = '#aaa'
    }
    return status
  }
}, {
  label: '创建时间',
  prop: 'createTime',
  width: 150,
  formatter: function (h, row) {
    return h('span', {}, row.createTime ? moment(new Date(row.createTime)).format('YYYY-MM-DD hh:mm:ss') : '')
  }
}, {
  label: '操作',
  width: 110,
  formatter: function (h, row) {
    var actions = h('div', {
      class: {
        'table-btns': true
      },
      children: [
        h('span', {
          class: {
            'btn-text': true
          },
          on: {
            click: function () {
              message.confirm('该操作不可恢复，是否继续？', function () {
                deleteEmail({id: row._id}).then(function (res) {
                  if (res.data.code === 200) {
                    message.msg({
                      message: res.data.message,
                      type: 'success'
                    })
                    getEamils(pageNation)
                  } else {
                    message.msg({
                      message: res.data.message,
                      type: 'error'
                    })
                  }
                })
              })
            }
          }
        }, '删除')
      ]
    })
    var reply = h('span', {
      class: {
        'btn-text': true
      },
      on: {
        click: function () {
          window.location.href = '/admin/emailEdit?id=' + row._id
        }
      }
    }, '回复')
    var view = h('span', {
      class: {
        'btn-text': true
      },
      on: {
        click: function () {
          window.location.href = '/admin/emailEdit?id=' + row._id
        }
      }
    }, '查看')
    if (row.status === 1) {
      actions.appendChild(reply)
    } else {
      actions.appendChild(view)
    }
    return actions
  }
}]

const formModel = [
 {
  prop: 'sender',
  label: '发件人',
  tag: 'input',
  attrs: {
    disabled: true
  }
 }, {
  prop: 'subject',
  label: '邮件主题',
  tag: 'input',
  attrs: {
    maxlength: 50
  },
  dataset: {
    required: true
  }
}, {
  prop: 'content',
  label: '邮件内容',
  tag: 'textarea',
}, {
  prop: 'senderEmail',
  label: '发件人邮箱',
  tag: 'input',
  attrs: {
    maxlength: 200
  }
}]
// 拉取所有邮件
function emailList () {
  return $http.get('/api/emailList')
}
// 删除邮件
function deleteEmail (params) {
  return $http.get('/api/deleteEmail', params)
}
// 邮件详情
function detailEmail (params) {
  return $http.get('/api/detailEmail/', params)
}
// 邮件保存
function saveEmail (params) {
  return $http.post('/api/mailto', params)
}
