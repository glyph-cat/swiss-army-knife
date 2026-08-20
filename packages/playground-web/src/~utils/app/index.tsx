import { AppUtils } from '@glyph-cat/swiss-army-knife'
import { INTERNAL_APP_IDENTIFIER } from '~constants'

export const { createStorageKey } = new AppUtils(INTERNAL_APP_IDENTIFIER)
