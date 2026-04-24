import { UnsupportedPlatformError } from '@glyph-cat/foundation'
import { JSX } from 'react'

export function Surface(): JSX.Element {
  throw new UnsupportedPlatformError()
}
