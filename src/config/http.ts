import axios from 'axios'

axios.interceptors.request.use(request => {
  request.headers.Authorization = '' // Token goes here
  return request
})

const http = axios

export default http
