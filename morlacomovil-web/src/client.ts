import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import router from './router'

const DEFAULT_CONTENT_TYPE: string = 'application/json'

const getBaseUrl = (): string => {
  console.log(window.GLOBAL_CONFIG)
  return window.GLOBAL_CONFIG.API_URL
}

const getApiUrl = (): string => {
  return `${getBaseUrl()}`
}

const requestMiddleware = (config: InternalAxiosRequestConfig) => {
  config.baseURL = getApiUrl()
  config.headers['x-apikey'] = '64a2e9bc86d8c525a3ed8f63'
  config.headers['Accept'] = DEFAULT_CONTENT_TYPE
  config.headers['Content-Type'] = DEFAULT_CONTENT_TYPE
  return config
}

const responseFulfilled = async (response: AxiosResponse) => {
  console.log(response)
  return response
}

const responseRejected = async (error: AxiosError) => {
  console.log(error)

  if (error.code === 'ERR_NETWORK') {
    throw new Error('No-API-Found')
  }

  if (error.response?.status == 401) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    await router.push({ name: 'login' })
    throw new Error('No-Authorized')
  }

  if (error.response?.status == 403) {
    throw new Error('No-Allowed')
  }

  throw new Error((error.response?.data as { message: string }).message)
}

const client: AxiosInstance = axios.create()

client.interceptors.request.use(requestMiddleware)
client.interceptors.response.use(responseFulfilled, responseRejected)

export default client
