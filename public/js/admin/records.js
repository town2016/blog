const tableModel = [
  {
    prop: 'ip',
    label: '访问IP'
  }, {
    prop: 'createTime',
    label: '创建时间',
    formatter: function (h, row) {
      return h('span', {},row.createTime ? moment(new Date(row.createTime)).format('YYYY-MM-DD hh:mm:ss') : '')
    }
  }, {
    prop: 'updateTime',
    label: '更新时间',
    formatter: function (h, row) {
      return h('span', {},row.updateTime ? moment(new Date(row.updateTime)).format('YYYY-MM-DD hh:mm:ss') : '')
    }
  }, {
    prop: 'count',
    label: '访问次数'
  }
]
// 列表
function findRecords (params) {
  return $http.get('/admin/browseRecordList', params)
}
