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
  item.attrs.name = item.attrs.id = item.prop
  switch (item.tag) {
    case 'select':
    break;
    default:
    formControl.appendChild(form.createInput(item.attrs, item.dataset, that))
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
  createInput: function (attrs, dataset, that) {
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
