const tableModel = [
  {
    prop: 'ip',
    label: '访问IP'
  }, {
    prop: 'createTime',
    label: '创建时间'
  }, {
    prop: 'updateTime',
    label: '更新时间'
  }, {
    prop: 'count',
    label: '访问次数'
  }
]
// 列表
function findRecords (params) {
  return $http.get('/admin/browseRecordList', params)
}
