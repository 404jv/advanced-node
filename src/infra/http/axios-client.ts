import axios from 'axios'
import { HttpGetClient } from './client'

export class AxiosHttpClient {
  async get <T = any> ({ params, url }: HttpGetClient.Params): Promise<T> {
    const result = await axios.get(url, { params })
    return result.data
  }
}
