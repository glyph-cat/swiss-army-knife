import { INTERNAL_APP_IDENTIFIER } from '~constants'

export function createStorageKey(key: string): string {
  return `${INTERNAL_APP_IDENTIFIER}/${key}`
}
