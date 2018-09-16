function Pager(mount, total) {
  this.id = 'pager_' + new Date().getTime()
  this.curPage = 1
  this.pageSize = 3
  this.totalPage = Math.ceil(total / this.pageSize)
  this.init = function() {
    mount.appendChild(this.renderUi())
  }
  this.init()
}
Pager.prototype.renderUi = function() {
  var pager = document.createElement('div')
  pager.id = this.id
  pager.className = 'pager'
  var first = document.createElement('span')
  first.className = 'first'
  first.innerText = '首页'
  pager.appendChild(first)
  var previous = document.createElement('span')
  previous.className = 'previous'
  previous.innerText = '上一步'
  pager.appendChild(previous)
  var pageList = document.createElement('div')
  pageList.className = 'pageList'
  Pager.initPageList(pageList, this)
  pager.appendChild(pageList)
  var next = document.createElement('span')
  next.className = 'next'
  next.innerText = '下一步'
  pager.appendChild(next)
  var last = document.createElement('span')
  last.className = 'last'
  last.innerText = '末页'
  pager.appendChild(last)
  return pager
}
Pager.initPageList = function (pageList, that) {
 var i = 0
  while (i < that.totalPage) {
    var pageNum = document.createElement('span')
    pageNum.innerText = i * 1 + 1
    pageNum.className = 'pageNum'
    eventHandler.addEvent(pageNum, 'click', function () {
      that.curPage = Number(this.innerText)
      Pager.setCurPage(this.innerText, that)
    })
    pageList.appendChild(pageNum)
    i++
  }
}

Pager.setCurPage = function (index, that) {
  that.curPage = Number(index)
  let pageList = document.querySelector('#' + that.id).querySelectorAll('.pageNum')
  for (var i = 0; i < pageList.length; i++) {
    var item = pageList[i]
    if (item.innerText === index) {
      item.classList.add('active')
    } else {
      item.classList.remove('active')
    }
  }
}
