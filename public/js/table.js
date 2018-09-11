// 创建表格对象
function Table (model, data, el) {
  return {
    id: new Date().getTime(),
    tableModel: model || [],
    tableData: data || [],
    parent: el,
    create: function () {
      let html = `<table id="${this.id}">
                    <thead>
                      <tr>${this.createThead()}<tr>
                    </thead>
                    <tbody>${this.createTbody()}</tbody>
                  </table>`;
      el.innerHTML = html
    },
    createThead: createThead,
    createTbody: createTbody,
    createTd: createTd,
    
  }
}
// 创建表头
function createThead () {
  let thead = '';
  this.tableModel.map(item => {
    thead += `<th id="${item.prop}">${item.label}</th>`
  })
  return thead
}
// 创建表格主体
function createTbody () {
  let tbody = '';
  this.tableData.map((item, index) => {
    tbody += `<tr>${this.createTd(item)}</tr>`
  })
  return tbody
}
// 创建表格
function createTd (data) {
  let td = ''
  this.tableModel.map((item, index) => {
    if (item.formater) {
      td += `<td>${item.formater(data[item.prop])}</td>`
    } else {
      td += `<td>${data[item.prop] ? data[item.prop] : ''}</td>`
    }
  })
  return td
}
// 自定义render
function render (el, options, text) {}
