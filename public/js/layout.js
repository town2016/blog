function questionSubmit (params) {
  return $http.post('/api/question', params)
}

function questionQury () {
  return $http.get('/api/question')
}
