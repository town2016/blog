const tableModel = [
  {
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
    prop: 'createTime'
  }, {
    label: '更新时间',
    prop: 'updateTime'
  }, {
    label: '作者',
    prop: 'auther'
  }, {
    label: '操作',
  }
]


const formModel = [
  {
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
    focus: function (Select) {
      $http.get('/admin/categorys').then(function (res) {
        var categoryList = res.data.data || [], optionsHtml = '';
        categoryList.forEach(function (item) {
          optionsHtml += '<option value="' + item.categoryCode + '">' + item.categoryName + '</option>'
        })
        Select.innerHTML = optionsHtml
      })
    },
    options: []
  }, 
]
