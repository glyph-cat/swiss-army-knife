import { UnsupportedPlatformError } from '@glyph-cat/swiss-army-knife'
import { JSX } from 'react'

export function Select(): JSX.Element {
  throw new UnsupportedPlatformError()
}
