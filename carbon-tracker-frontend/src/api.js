import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',  // backend base URL
  withCredentials: true,                // include cookies
})

export default api
