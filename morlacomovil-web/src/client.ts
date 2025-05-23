import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import router from './router'

const DEFAULT_CONTENT_TYPE: string = 'application/json'

const getBaseUrl = (): string => {
  return window.GLOBAL_CONFIG.API_URL
}

const getApiUrl = (): string => {
  return `${getBaseUrl()}`
}

const requestMiddleware = (config: InternalAxiosRequestConfig) => {
  config.baseURL = getApiUrl()
  config.headers["Content-Type"] = DEFAULT_CONTENT_TYPE;
  config.headers['x-apikey'] = window.GLOBAL_CONFIG.API_KEY
  return config
}

const responseFulfilled = async (response: AxiosResponse) => {
  return response
}
const responseRejected = async (error: AxiosError) => {

  if (error.code === 'ERR_NETWORK') {
    throw new Error('No-API-Found')
  }

  if (error.response?.status == 401) {
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
