const tableModel = [{
  prop: 'categoryName',
  label: '分类名称'
}, {
  prop: 'categoryCode',
  label: '分类编码'
}, {
  prop: 'count',
  label: '文章挂载量'
}, {
  prop: 'createTime',
  label: '创建时间'
}, {
  prop: 'updateTime',
  label: '更新时间'
}, {
  prop: '_actions',
  label: '操作',
  width: 120,
  formatter: function(h, params) {
    return h('div', {
      class: {
        'table-btns': true
      },
      children: [
        h('span', {
          class: {
            'btn-text': true
          },
          on: {
            click: function() {}
          }
        }, '编辑'),
        h('span', {
          class: {
            'btn-text': true
          },
          on: {
            click: function() {
              deletes(params)
            }
          }
        }, '删除')
      ]
    })
  }
}]
// 拉取分类列表
function getCategoryList() {
  return $http.get('/admin/categorys')
}
// 保存分类信息
function saveCategory(params) {
  return $http.post('/admin/saveCategory', params)
}
// 删除分类
function deleteCategory(params) {
  return $http.get('/admin/deleteCategory', params)
}