import axios from 'axios'

axios.interceptors.request.use(request => {
  request.headers.Authorization = `Bearer ${process.env.WA_ACCESS_TOKEN}`
  return request
})

const WhatsappNetwork = axios

export default WhatsappNetwork