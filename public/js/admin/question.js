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
            }
          }, '删除'),
          h('span', {
            class: {
              'btn-text': true
            }
          }, '编辑')
        ]
      })
    }
  }
]
function findQuestions (params) {
  return $http.get('/api/question', params)
}
