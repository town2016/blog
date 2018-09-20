const tableModel = [
  {
    prop: 'question',
    label: '问题'
  }, {
    prop: 'description',
    label: '描述'
  }, {
    prop: 'answer',
    label: '回答',
    width: 400
  }, {
    prop: 'createTime',
    label: '创建时间',
    width: 130,
    formatter (h, row) {
      return h('span', {}, row.createTime ? moment(new Date(row.createTime)).format('YYYY-MM-DD hh:mm:ss') : '')
    }
  }, {
    prop: 'updateTime',
    label: '更新时间',
    width: 130,
    formatter (h, row) {
      return h('span', {}, row.updateTime ? moment(new Date(row.updateTime)).format('YYYY-MM-DD hh:mm:ss') : '')
    }
  }, {
    label: '操作',
    width: 120,
    formatter (h, row) {
      return h('div',{
        class: {
          'table-btns': true
        },
        children: [
          h('span', {
            class: {
              'btn-text': true
            },
            on: {
              click: () => {
                message.confirm('该操作无法回复，是否继续？', function () {
                  deleteQuestion({id: row._id}).then(function (res) {
                    if (res.data.code === 200) {
                      message.msg({
                        message: res.data.message,
                        type: 'success'
                      })
                      getQuestion(pageNation)
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
          }, '删除'),
          h('span', {
            class: {
              'btn-text': true
            },
            on: {
              click: () => {
                getDetail(row)
              }
            }
          }, '回答')
        ]
      })
    }
  }
]
const formModel = [
  {
    tag: 'input',
    label: '问题',
    prop: 'question',
    attrs: {
      placeholder: '请输入你的问题',
      disabled: true
    },
    dataset: {
      required: true
    }
  }, {
    tag: 'textarea',
    label: '回答',
    prop: 'answer',
    attrs: {
      placeholder: '请输入你的回答'
    },
    dataset: {
      required: true
    }
  }
]
// 列表
function findQuestions (params) {
  return $http.get('/api/question', params)
}
// 详情
function detailQuestion (params) {
  return $http.get('/api/detailQuestion', params)
}
// 编辑
function editQuestion (params) {
  return $http.post('/api/editQuestion', params)
}
// 删除
function deleteQuestion (params) {
  console.log(params)
  return $http.get('/api/deleteQuestion', params)
}
