// 拉取分类列表
function getCategoryList () {
  return  $http.get('/admin/categorys')
}
// 保存分类信息
function saveCategory (params) {
  return $http.post('/admin/saveCategory', params)
}
// 删除分类
function deleteCategory (params) {
  return $http.get('/admin/deleteCategory', params)
}
