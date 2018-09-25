// 提交问答
function questionSubmit (params) {
  return $http.post('/api/question', params)
}
// 查询所有问答
function questionQuery () {
  return $http.get('/api/question')
}
// 提交浏览
function visitSubmit () {
  return $http.post('/api/visit')
}
// 查询浏览
function visitQuery () {
  return $http.get('/api/visit')
}
const commonParams = {
  g_tk : 5381,
  format : 'json',
  inCharset : 'utf-8',
  outCharset : 'utf-8',
  notice:0
}

function getSongList(){
  return $http.get('/api/songList')
}
