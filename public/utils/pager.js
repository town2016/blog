function Pager(mount, fn) {
  let that = this
  this.id = 'pager_' + new Date().getTime()
  this.curPage = 1
  this.pageSize = 5
  this.pages = [5, 10, 20, 30]
  this.events = {}
  this.pager = {
    tha: 0,
    set total(num) {
      this.totalNum = num
      that.totalPage = Math.ceil(this.totalNum / that.pageSize)
      that.init()
    },
    get total () {
      return this.totalNum
    }
  }
  this.change = function () {
    fn && fn(this.curPage, this.pageSize)
  }
  this.totalPage = Math.ceil(this.pager.totalNum / this.pageSize)
  this.init = function() {
     // 创建pager容器
    var pager = document.getElementById(this.id)
    if (!pager) {
      pager = document.createElement('div')
      pager.id = this.id
      pager.className = 'pager'
      this.renderUi(pager)
      mount.appendChild(pager)
      Pager.setCurPage(this.curPage, this)
    } else {
      pager.innerHTML = ''
      this.renderUi(pager)
      Pager.setCurPage(this.curPage, this)
    }
    
  }
  this.init()
}
// 自定义事件绑定
Pager.prototype.on = function (type, fn) {
  if (!this.events[type]) {
    this.events[type] = []
  }
  if (typeof(fn) === 'function') {
    this.events[type].push(fn)
  }
  return this
}
// 自定义事件触发
Pager.prototype.fire = function (type) {
  var eventList = this.events[type] || []
  for (var i = 0; i < eventList.length; i++) {
    if (typeof(eventList[i]) === 'function') {
      eventList[i](this)
    }
  }
  return this
}
// 自定义事件解除绑定
Pager.prototype.remove = function (type, fn) {
  var eventList = this.events[type] || []
  if (typeof(fn) === fn) {
    for (var i = 0; i < eventList.length; i++) {
      if (eventList[i] === fn) {
        this.events[type].splice(i, 1)
        break
      }
    }
  } else {
    delete this.events[type]
  }
  return this
}
// 初始化UI
Pager.prototype.renderUi = function(pager) {
  let that = this
  // 总条数
  var total = document.createElement('div')
  total.style.cssText = 'display:inline-block;vertical-align: middle; margin-right: 10px;'
  total.innerText = '共 ' + that.pager.totalNum + ' 条'
  pager.appendChild(total)
  // pageSize
  var pageSize = document.createElement('select')
  pageSize.style.cssText = 'display: inline-block;width: 50px; margin-right: 10px; border-radius: 2px;'
  var pageSizeOpt = ''
  that.pages.forEach(item => {
    if (item === that.pageSize) {
      pageSizeOpt += '<option value="' + item + '" selected>' + item + '</option>'
    } else {
      pageSizeOpt += '<option value="' + item + '">' + item + '</option>'
    }
  })
  pageSize.innerHTML = pageSizeOpt
  pageSize.onchange = function ($event) {
    var target = eventHandler.getTarget($event), value = target.value
    that.pageSize = Number(value)
    var options = this.querySelectorAll('option')
    that.change()
  }
  pager.appendChild(pageSize)
  //首页
  var first = document.createElement('span')
  first.className = 'first'
  first.innerText = '首页'
  first.onclick = function () {
    Pager.first(that)
  }
  pager.appendChild(first)
  // 上一步
  var previous = document.createElement('span')
  previous.className = 'previous'
  previous.innerText = '上一页'
  previous.onclick = function () {
    Pager.previous(that)
  }
  pager.appendChild(previous)
  // 页码
  var pageList = document.createElement('div')
  pageList.className = 'pageList'
  Pager.initPageList(pageList, 0, this.totalPage, this)
  pager.appendChild(pageList)
  // 下一步
  var next = document.createElement('span')
  next.className = 'next'
  next.innerText = '下一页'
  next.onclick = function () {
    Pager.next(that)
  }
  pager.appendChild(next)
  // 末页
  var last = document.createElement('span')
  last.className = 'last'
  last.innerText = '末页'
  last.onclick = function () {
    Pager.last(that)
  }
  pager.appendChild(last)
  return pager
}
// 上一页
Pager.previous = function (that) {
  if (that.curPage === 1) {
    return
  }
  this.setCurPage(that.curPage - 1, that);
  (that.curPage < that.totalPage) && this.getMorePageNum(that)
  that.change()
}
// 下一页
Pager.next = function (that) {
  if (that.curPage === that.totalPage) {
    return
  }
  this.setCurPage(that.curPage + 1, that);
  (that.curPage < that.totalPage) && this.getMorePageNum(that)
  that.change()
}
// 首页
Pager.first = function (that) {
  if (that.curPage === 1) {
    return
  }
  this.setCurPage(1, that);
  (that.curPage < that.totalPage) && this.getMorePageNum(that)
  that.change()
}
// 末页
Pager.last = function (that) {
  if (that.curPage === that.totalPage) {
    return
  }
  this.setCurPage(that.totalPage, that);
  (that.curPage <= that.totalPage) && this.getMorePageNum(that)
  that.change()
}
// 页码
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
      that.change()
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
// 设置当前页
Pager.setCurPage = function (index, that) {
  if (that.pager.totalNum ===  0) {
    return
  }
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
// 获取更多页码
Pager.getMorePageNum = function (that) {
  if (that.pager.totalNum ===  0) {
    return
  }
  let pageList = document.querySelector('#' + that.id).querySelector(".pageList")
  pageList.innerHTML = ''
  let end = Math.min(that.curPage + 3, that.totalPage)
  end = Math.max(5, end)
  if (that.totalPage < 5) {
    end = that.totalPage
  }
  let start =  Math.max(0, that.curPage - 3)
  start = Math.min(that.totalPage - 5, start)
  start = start < 1 ? start = 0 : start
  Pager.initPageList(pageList, start, end, that)
  Pager.setCurPage(that.curPage, that)
}

