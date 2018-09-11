// 创建表格对象
function Table (model, Data, el) {
  return {
    id: new Date().getTime(),
    tableModel: model,
    tableData: data,
    parent: el,
    render: function () {
      let html = `<table id="${this.id}">
            <thead>
              <tr>${createdThead(this.model)}<tr>
            </thead>
            <tbpdy>
              ${createdTbody(this.model, this.data)}
            </tbody>
          </table>`
      el.innerHTML(html)
    }
  }
}


function createdThead (model = []) {
  let thead = '';
  model.map(item => {
    thead += `<th id="${item.prop}">${item.label}</th>`
  })
  return thead
}

function createdTbody (model = [], data = []) {
  let tbody = '';
  data.map((item, index) => {
    tbody += `<tr>${createTd(model, item)}</tr>`
  })
  return tobody
}

function createTd (model, data) {
  let td = ''
  model.map(item => {
    td += `<td>${data[item.prop]}</td>`
  })
  return td
}
