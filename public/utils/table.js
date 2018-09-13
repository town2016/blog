// 创建表格对象
function Table (model, el, data) {
  return {
    id: 't_' + new Date().getTime(),
    tableModel: model || [],
    tableList: data || [],
    parent: el,
    create: function () {
      let table = document.createElement('table')
      table.id = this.id
      table.appendChild(this.createThead())
      table.appendChild(this.createTbody())
      el.appendChild(table)
    },
    createThead: createThead,
    createTbody: createTbody,
    createTd: createTd,
    render: render,
    refreshData: refreshData,
    set tableData (list) {
      this.tableList = list
      this.refreshData()
    },
    get tableData () {
      return this.tableList
    }
  }
}
// 创建表头
function createThead () {
  var  html = '', thead = createElemetNode('thead'), tr = createElemetNode('tr'); thead.appendChild(tr)
  this.tableModel.map(item => {
    let th = createElemetNode('th')
    th.id = item.prop
    th.innerHTML = item.label
    if (item.width) th.width = item.width 
    tr.appendChild(th)
  })
  thead.appendChild(tr)
  return thead
}
// 创建表格主体
function createTbody () {
  let tbody = createElemetNode('tbody');
  if (this.tableList.length === 0) {
    tbody.innerHTML = `<tr><td colSpan='${this.tableModel.length}' align='center' style='font-size: 16px;'><font color='#aaa'>暂无数据</font></td><tr>`
    return tbody
  }
  this.tableList.map((row, index) => {
    var tr = createElemetNode('tr')
    tbody.appendChild(tr, this.createTd(tr, row))
  })
  return tbody
}
// 创建表格
function createTd (tr, data) {
  this.tableModel.map((item, index) => {
    if (item.formatter) {
      var td = createElemetNode('td')
      td.appendChild(item.formatter(this.render, data))
      tr.appendChild(td)
    } else {
      var td = createElemetNode('td', null, data[item.prop] === undefined || data[item.prop] === null ? '' : data[item.prop])
      tr.appendChild(td)
    }
  })
  return tr
}

function createElemetNode (tag, classes = null, innerText) {
  let elem = document.createElement(tag)
  if (classes) elem.className = addClass(classes)
  if (innerTexts = innerText !== undefined && innerText !== null ) elem.innerText = innerText
  return elem
}

// 自定义render
function render (el, options, text) {
  var elem = createElemetNode(el)
  // 元素添加class
  if (options.class) elem.className = addClass(options.class)
  // 元素写入内容
  if (text) elem.innerText = text
  // 元素绑定事件
  if (options.on) {
    let events = options.on
    for (var k in events) {
      bindEvent(elem, k, events[k])
    }
  }
  // 元素添加子元素
  if (options.children && options.children.length > 0) {
    options.children.map(item => {
      elem.appendChild(item)
    })
  }
  return elem
}
// 绑定class
function addClass (classObj) {
  let classArr = []
  for (var k in classObj) {
    classObj[k] && classArr.push(k)
  }
  return classArr.join(' ')
}
// 事件绑定
function bindEvent (el, type, fn) {
  eventHandler.addEvent(el, type, fn)
}
// 数据刷新
function refreshData () {
  var table = document.querySelector('#' + this.id)
  let tbody = this.createTbody()
  table.querySelector('tbody').remove()
  table.appendChild(tbody)
}
