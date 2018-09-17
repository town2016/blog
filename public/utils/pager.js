function Pager(mount, total) {
  this.id = 'pager_' + new Date().getTime()
  this.curPage = 1
  this.pageSize = 5
  this.totalPage = Math.ceil(total / this.pageSize)
  this.init = function() {
    mount.appendChild(this.renderUi())
    Pager.setCurPage(this.curPage, this)
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
  Pager.initPageList(pageList, 0, this.totalPage, this)
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
Pager.initPageList = function (pageList, start, end, that) {
  var i = start
  let len = Math.min(5, (end - start))
  while (i < (len + start)) {
    var pageNum = document.createElement('span')
    pageNum.innerText = i * 1 + 1
    pageNum.index = i - start
    pageNum.className = 'pageNum'
    eventHandler.addEvent(pageNum, 'click', function () {
      that.curPage = Number(this.innerText);
      Pager.setCurPage(this.innerText, that);
      (that.curPage < that.totalPage) && Pager.getMorePageNum(that)
    })
    pageList.appendChild(pageNum)
    i++
  }
  if (that.totalPage - (len + start) > 0) {
    let more = document.createElement('span')
    more.innerText = '...'
    more.className = 'moreNum'
    pageList.appendChild(more)
  }
}

Pager.setCurPage = function (index, that) {
  that.curPage = Number(index)
  let pageList = document.querySelector('#' + that.id).querySelectorAll('.pageNum')
  for (var i = 0; i < pageList.length; i++) {
    var item = pageList[i]
    if (Number(item.innerText) === Number(index)) {
      item.classList.add('active')
    } else {
      item.classList.remove('active')
    }
  }
}

Pager.getMorePageNum = function (that) {
  let pageList = document.querySelector('#' + that.id).querySelector(".pageList")
  pageList.innerHTML = ''
  let end = Math.min(that.curPage + 3, that.totalPage)
  end = Math.max(5, end)
  let start =  Math.max(0, that.curPage - 3)
  start = Math.min(that.totalPage - 5, start)
  Pager.initPageList(pageList, start, end, that)
  Pager.setCurPage(that.curPage, that)
}
