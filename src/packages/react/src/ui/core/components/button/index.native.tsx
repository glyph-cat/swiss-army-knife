import { UnsupportedPlatformError } from '@glyph-cat/swiss-army-knife'
import { JSX } from 'react'

export function ButtonBase(): JSX.Element {
  throw new UnsupportedPlatformError()
}
