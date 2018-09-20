
var instance = axios.create({
  transformRequest: [function (data) {  
      return Qs(data)
    }],
    withCredentials:true,
});

window.$http = {
  get: function (url, params) {
    var _url
    if (params) {
      if (params.length) {
        _url = url + params[0]
      } else {
        _url = Qs(params).length > 0 ? url + '?' + Qs(params) : url
      }
    } else {
      _url = url
    }
    
    return instance.get(_url)
  },
  post: function (url, params) {
    return instance.post(url, params)
  }
}
function Qs (data) {
  let paramStr = ''
  for (var k in data) {
    var value = data[k] !== undefined ? data[k] : ''
    paramStr += `&${k}=${encodeURIComponent(value)}` // encodeURIComponent   把字符串作为 URI 组件进行编码。
  };
  return paramStr ? paramStr.substring(1) : ''
}

