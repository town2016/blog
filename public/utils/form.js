function Iform (mount, formModel, btns) {
  this.id =  'f_' + new Date().getTime()
  this.formModel = formModel || []
  this.datas = {}
  this.btns = btns || []
  let that = this
  this.form = {
    set formData (formData) {
      that.datas = formData
      that.setValue()
    },
    get formData () {
      return that.datas
    }
  }
  this.create(mount)
  this.reset = function () {
    document.getElementById(this.id).reset()
  }
}

Iform.prototype.create = function (mount) {
  var form = document.createElement('form'), that = this
  form.id = that.id
  // 给表单添加重置事件监听
  eventHandler.addEvent(form, 'reset', function() {
    that.form.formData = {}
  })
  // 创建表单组件
  that.formModel.forEach(item => {
    form.appendChild(Iform.createFormItem(item, that))
  })
  // 创建按钮
  that.btns && form.appendChild(Iform.createBtns(that.btns))
  // 表单挂载
  mount.appendChild(form)
}
Iform.createFormItem  = function (item, that) {
  // 创建表单组件外部结构
  var formGroup = document.createElement('div')
  formGroup.className = 'form-group'
  var label = document.createElement('label')
  label.className = 'form-label'
  label.innerText = item.label || ''
  formGroup.appendChild(label)
  var formControl = document.createElement('div')
  formControl.className = 'form-control'
  // 创建表单组件
  formGroup.appendChild(formControl)
  // 给表单组件添加name和id属性
  item.attrs || (item.attrs = {})
  item.dataset || (item.dataset = {})
  item.attrs.name = item.attrs.id = item.prop
  switch (item.tag) {
    case 'select':
    formControl.appendChild(form.createSelect(item, that))
    break;
    case 'textarea':
    formControl.appendChild(form.createTextarea(item, that))
    break
    default:
    formControl.appendChild(form.createInput(item, that))
  }
  return formGroup
}
// 创建表单赋值监听
Iform.prototype.setValue = function () {
  var elements = document.getElementById(this.id).elements, i = 0
  while (i < elements.length) {
    var el = elements[i]
    el.value = this.form.formData[el.name] ? this.form.formData[el.name] : ''
    i++
  }
}
// 创建按钮组
Iform.createBtns = function (btns) {
  var div = document.createElement('div')
  div.className = 'form-btns'
  btns.forEach(function (item) {
    var btn = document.createElement('span')
    btn.className = 'btn'
    form.addClass(btn, item.classes)
    btn.innerText = item.text
    form.bindEvent(btn, item.on)
    div.appendChild(btn)
  }) 
  return div
}
// 创建表单组件
const form = {
  // 创建input组件
  createInput: function (_input, that) {
    var attrs = _input.attrs, dataset = _input.dataset;
    var Input = document.createElement('input')
    attrs && form.createAttributes(Input, attrs, 'attrs')
    dataset && form.createAttributes(Input, dataset, 'dataset')
    eventHandler.addEvent(Input, 'change', function () {
      var elements = document.getElementById(that.id).elements, i = 0
      while (i < elements.length) {
        var el = elements[i]
        that.form.formData[el.name] = el.value
        i++
      }
    })
    return Input
  },
   // 创建textarea组件
  createTextarea: function (_textarea, that) {
    var attrs = _textarea.attrs, dataset = _textarea.dataset;
    var Textarea = document.createElement('textarea')
    attrs && form.createAttributes(Textarea, attrs, 'attrs')
    dataset && form.createAttributes(Textarea, dataset, 'dataset')
    eventHandler.addEvent(Textarea, 'change', function () {
      var elements = document.getElementById(that.id).elements, i = 0
      while (i < elements.length) {
        var el = elements[i]
        that.form.formData[el.name] = el.value
        i++
      }
    })
    return Textarea
  },
  // 创建下拉框
  createSelect: function (_select, that) {
    var attrs = _select.attrs, dataset = _select.dataset, options = _select.options || [], optionsHtml = ''
    var Select = document.createElement('select')
    attrs && form.createAttributes(Select, attrs, 'attrs')
    dataset && form.createAttributes(Select, dataset, 'dataset')
    eventHandler.addEvent(Select, 'change', function () {
      var elements = document.getElementById(that.id).elements, i = 0
      while (i < elements.length) {
        var el = elements[i]
        that.form.formData[el.name] = el.value
        i++
      }
    })
    try{
      if (options.length > 0) {
        options.forEach(function (item) {
          optionsHtml += '<option value="' + item[_select.colValue] + '">' + item[_select.col] + '</option>'
        })
      } else {
        optionsHtml = '<option disabled>暂无数据</option>'
      }
    }catch(e){
    	console.log(e)
    }
    eventHandler.addEvent(Select, 'focus', function () {
      _select.focus && _select.focus(Select)
    })
    Select.innerHTML = optionsHtml
    return Select
  },
  // 元素绑定属性
  createAttributes: function (el, attrs, sign) {
    if (sign === 'dataset') {
      for (var k in attrs) {
        el.setAttribute('data-' + k, attrs[k])
      }
    } else {
      for (var k in attrs) {
        el.setAttribute(k, attrs[k])
      }
    }
  },
  // 元素添加class
  addClass: function (el, classes){
    classes.forEach(item => {
      el.classList.add(item)
    })
  },
  // 元素事件绑定
  bindEvent: function (el, eventMap) {
    for (var k in eventMap) {
      eventHandler.addEvent(el, k, eventMap[k])
    }
  }
}
