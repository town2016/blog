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
  label: '创建时间',
  formatter: function (h, params) {
    return h('soan', {}, params.createTime ? moment(new Date(params.createTime)).format('YYYY-MM-DD hh:mm:ss') : '')
  }
}, {
  prop: 'updateTime',
  label: '更新时间',
  formatter: function (h, params) {
    return h('soan', {}, params.updateTime ? moment(new Date(params.updateTime)).format('YYYY-MM-DD hh:mm:ss') : '')
  }
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
            click: function() {
              getDetail(params)
            }
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
const formModel = [
  {
    tag: 'input',
    label: '分类名称',
    prop: 'categoryName',
    attrs: {
      placeholder: '请输入分类名称'
    },
    dataset: {
      required: true
    }
  }, {
    tag: 'input',
    label: '分类编码',
    prop: 'categoryCode',
    attrs: {
      placeholder: '请输入分类编码'
    },
    dataset: {
      required: true
    }
  }
]
const btns = [
  {
    text: '保存',
    classes: ['btn-primary'],
    on: {
      click: function (event) {
        save(event)
      }
    }
  }, {
    text: '重置',
    classes: ['btn-default'],
    on: {
      click: function (event) {
        resetForm(event)
      }
    }
  }
]
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
// 拉取分类详情
function detailCategory (params) {
  return $http.get('/admin/detailCategory', params)
}
