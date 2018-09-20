function Message () {
  this._default = {
    durations: 3000,
    type: 'default'
  }
}
Message.prototype.msg = function (options) {
  let that = this
  if (Object.prototype.toString.call(options) === '[object Object]') {
    this._default = Object.assign({}, this._default, options)
  }
  if (!this._default.message) {
    return
  }
  var box = document.createElement('div');
  box.style.cssText = 'max-width:400px;background-color: #fff;border-radius: 4px;font-size: 14px; padding: 6px 20px;overflow: hidden;position: absolute;z-index: 1001;top: 10%;margin-top:-100px;left:50%;box-shadow: 0 0 5px rgba(0,0,0,0.5);visibility: hidden;'
  switch (this._default.type) {
    case 'success':
      box.innerHTML = '<span class="icon-success" style="margin-right:10px"></span>' + this._default.message;
    break
    case 'error':
      box.innerHTML = '<span class="icon-error" style="margin-right:10px"></span>' + this._default.message;
    break
    case 'warning':
      box.innerHTML = '<span class="icon-warn" style="margin-right:10px"></span>' + this._default.message;
    break
    default:
      box.innerText = this._default.message;
  }
  document.body.appendChild(box)
  // 计算居中偏移量
  setTimeout(function () {
    var width = box.offsetWidth;
    box.style.marginLeft = -(width / 2) + 'px';
    box.style.visibility = 'visible';
    // 出场动画
    setTimeout (function () {
      box.style.transition = 'all .3s linear';
      box.style.marginTop = '0';
    }, 17)
    // 消失
    setTimeout(function () {
      box.remove()
    }, that._default.durations)
  }, 17)
  
}
Message.prototype.confirm = function (message, title, fn) {
  var _title = typeof arguments[1] === 'string' || '温馨提示'
  var _fn = typeof arguments[1] === 'function' ? arguments[1] : arguments[2]
  var wrapper = document.createElement('div')
  wrapper.style.cssText = 'position: fixed;top: 0;left: 0; right: 0;bottom: 0;z-index: 998;'
  var mask = document.createElement('div')
  mask.style.cssText = 'background-color: #000; opacity: 0.7;filter: alpha(opacity=70); position: absolute;top: 0;left:0;right:0;bottom:0;'
  mask.onclick = function () {
    wrapper.remove()
  }
  wrapper.appendChild(mask)
  var box = document.createElement('div');
  box.style.cssText = 'width:400px;background-color: #fff;border-radius: 4px; padding: 6px 12px;overflow: hidden;position: absolute;z-index: 1000;top: 30%;left:50%;margin-left: -212px;'
  wrapper.appendChild(box)
  var header = document.createElement('div');
  header.style.cssText = 'font-size: 14px; line-height: 20px;padding: 8px 0 15px 0;border-bottom: 1px solid #eee;'
  header.innerHTML = '<span class="icon-question" style="margin-right:10px"></span>' + _title;
  box.appendChild(header);
  var body = document.createElement('div');
  body.style.cssText = 'font-size: 14px; line-height: 20px;letter-spacing: 2px;padding: 10px 0;min-height: 2em;';
  body.innerText = message;
  box.appendChild(body);
  var footer = document.createElement('div');
  footer.style.cssText = 'padding: 10px 0;text-align: right;border-top: 1px solid #eee;'
  var cancel = document.createElement('span');
  cancel.innerText = '取消'
  cancel.className = 'btn btn-default'
  cancel.onclick = function () {
    wrapper.remove()
  }
  var confirm = document.createElement('div');
  confirm.className = 'btn btn-primary'
  confirm.innerText = '确定'
  confirm.onclick = function () {
    if (_fn) {
      _fn()
      wrapper.remove()
    }
  }
  footer.appendChild(cancel);
  footer.appendChild(confirm);
  box.appendChild(footer);
  document.body.appendChild(wrapper);
}

window.message = new Message()
