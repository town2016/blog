function dialog (options) {
  let that = this
  this.id = 'dialog_' + new Date().getTime()
  this._default = {
    title: '模态窗'
  }
  this._default = Object.assign({}, this._default, options)
  this.close = function () {
    that._default.close && that._default.close()
    that._default.content.style.display = 'none'
    document.body.appendChild(that._default.content)
    document.querySelector('#' + that.id).remove()
  }
  this.render = function () {
    var dialog = document.createElement('div')
    dialog.id = this.id
    dialog.className = '_dialog'
    dialog.style.cssText = 'position: fixed; z-index: 1000; left: 0; right: 0; top: 0; bottom: 0;'
    var mask = document.createElement('div')
    mask.className = '_mask'
    mask.style.cssText = 'position: absolute; z-index: 1000; left: 0; right: 0; top: 0; bottom: 0;background-color: #000; opacity: 0.6; filter: alpha(opacity=60);'
    dialog.appendChild(mask)
    if (this._default.maskClose) {
      mask.onclick = this.close
    }
    var body = document.createElement('div')
    body.className = '_dialog_body'
    body.style.cssText = 'min-width:40%;background-color: #fff;border-radius: 4px; padding: 10px 16px;position: absolute; z-index: 1001; top: 40%; left: 50%;visibility: hidden;'
    var title = document.createElement('div')
    title.innerText = this._default.title
    title.style.cssText = 'font-size: 14px;color: #333;padding-bottom: 16px;border-bottom:1px solid #eee;position: relative;'
    var close = document.createElement('span')
    close.innerHTML = '&Chi;'
    close.style.cssText = 'font-size: 16px; padding: 10px; position: absolute;top: -10px; right: 0px; cursor: pointer; color: #ddd;'
    close.onclick = this.close
    title.appendChild(close)
    body.appendChild(title)
    var content = document.createElement('div')
    content.style.cssText = 'padding: 10px 0;'
    if (this._default.content){
      this._default.content.style.display = 'block'
      content.appendChild(this._default.content)
    }
    body.appendChild(content)
    dialog.appendChild(body)
    document.body.appendChild(dialog)
    setTimeout(function () {
      var moveX = body.offsetWidth / 2
      var moveY = body.offsetHeight / 2
      body.style.marginLeft = -moveX + 'px'
      body.style.marginTop = -moveY + 'px'
      body.style.visibility = 'visible'
    }, 17)
  }
  this.render()
  return this
}
