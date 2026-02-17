import { UnsupportedPlatformError } from '@glyph-cat/foundation'
import { JSX } from 'react'

export function Select(): JSX.Element {
  throw new UnsupportedPlatformError()
}
