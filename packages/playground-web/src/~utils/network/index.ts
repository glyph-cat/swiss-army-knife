import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'query-string'
import { ENV } from '~constants'

/**
 * @private
 */
interface NetworkConfigTemplateOptions {
  config?: AxiosRequestConfig
  token?: string
}

/**
 * @private
 */
function getNetworkConfigTemplate({
  config: customConfig = {},
}: NetworkConfigTemplateOptions): AxiosRequestConfig {
  const {
    headers: customHeaders,
    ...remainingCustomConfig
  } = customConfig
  return {
    headers: {
      api_key: ENV.APP_API_KEY,
      ...customHeaders,
    },
    ...remainingCustomConfig,
  }
}

/**
 * @public
 */
export async function networkGet<Q extends qs.StringifiableRecord, R>(
  url: string,
  query?: Q,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<R>> {
  const FINAL_url = qs.stringifyUrl({ url, query })
  const FINAL_config = getNetworkConfigTemplate({ config })
  const res = await axios.get(FINAL_url, FINAL_config)
  return res
}

/**
 * @public
 */
export async function networkPost<Q extends qs.StringifiableRecord, D, R>(
  url: string,
  query?: Q,
  data?: D,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<R>> {
  const FINAL_url = qs.stringifyUrl({ url, query })
  const FINAL_config = getNetworkConfigTemplate({ config })
  const res = await axios.post(FINAL_url, data, FINAL_config)
  return res
}

/**
 * @public
 */
export async function networkDelete<Q extends qs.StringifiableRecord, R>(
  url: string,
  query?: Q,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<R>> {
  const FINAL_url = qs.stringifyUrl({ url, query })
  const FINAL_config = getNetworkConfigTemplate({ config })
  const res = await axios.delete(FINAL_url, FINAL_config)
  return res
}
