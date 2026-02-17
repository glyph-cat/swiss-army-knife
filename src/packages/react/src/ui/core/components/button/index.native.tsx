import { UnsupportedPlatformError } from '@glyph-cat/foundation'
import { JSX } from 'react'

export function ButtonBase(): JSX.Element {
  throw new UnsupportedPlatformError()
}
