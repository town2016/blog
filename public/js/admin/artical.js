const tableModel = [{
  label: '标题',
  prop: 'title'
}, {
  label: '简介',
  prop: 'summary'
}, {
  label: '分类',
  prop: 'category'
}, {
  label: '创建时间',
  prop: 'createTime',
  formatter: function (h, row) {
    return h('span', {}, row.createTime ? moment(new Date(row.createTime)).format('YYYY-MM-DD hh:mm:ss') : '')
  }
}, {
  label: '更新时间',
  prop: 'updateTime',
  formatter: function (h, row) {
    return h('span', {}, row.updateTime ? moment(new Date(row.updateTime)).format('YYYY-MM-DD hh:mm:ss') : '')
  }
}, {
  label: '作者',
  prop: 'auther'
}, {
  label: '操作',
  formatter: function (h, row) {
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
            click: function () {
              window.location.href = '/admin/articalAdd?id=' + row._id
            }
          }
        }, '编辑'),
        h('span', {
          class: {
            'btn-text': true
          },
          on: {
            click: function () {
              message.confirm('该操作不可恢复，是否继续？', function () {
                deleteArtical({id: row._id, category: row.category}).then(function (res) {
                  if (res.data.code === 200) {
                    message.msg({
                      message: res.data.message,
                      type: 'success'
                    })
                    getArticalList(pageNation)
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
  }
}]

const formModel = [{
  prop: 'title',
  label: '标题',
  tag: 'input',
  attrs: {
    maxlength: 50
  },
  dataset: {
    required: true
  }
}, {
  prop: 'summary',
  label: '简介',
  tag: 'textarea',
  attrs: {
    maxlength: 200
  }
}, {
  prop: 'category',
  label: '分类',
  tag: 'select',
  col: 'categoryName',
  colValue: 'categoryCode',
  dataset: {
    required: true
  },
  options: []
}]
// 拉取所有的分类
function getCategorys() {
  return $http.get('/admin/categorys')
}
// 拉取文章列表
function articalList (pageNation) {
  return $http.get('/admin/articals', pageNation)
}
// 保存文章
function saveArtical (params) {
  return $http.post('/admin/saveArtical', params)
}
// 删除文章
function deleteArtical (params) {
  return $http.get('/admin/deleteArtical', params)
}
// 获取文章详情
function detailArtical (params) {
  return $http.get('/admin/detailArtical/', params)
}
