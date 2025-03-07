import { StringRecord } from '@glyph-cat/swiss-army-knife'
import { AxiosError } from 'axios'
import { CustomAPIError } from '../base'
import { LookupDictionary } from './lookup.scripted'

export function tryParseCustomAPIError(error: AxiosError): CustomAPIError {
  const data = error.response.data as StringRecord
  const code = data.code as number
  const errorConstructor = LookupDictionary[code]
  if (errorConstructor) {
    return new errorConstructor(data.data)
  }
  return null
}
