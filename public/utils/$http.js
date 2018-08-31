
var instance = axios.create({
  transformRequest: [function (data) {  
      return Qs(data)
    }],
    withCredentials:true,
});

window.$http = {
  get: function (url, params) {
    return instance.get(url, {params: params})
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

