import { UnsupportedPlatformError } from '@glyph-cat/swiss-army-knife'
import { JSX } from 'react'

export function Surface(): JSX.Element {
  throw new UnsupportedPlatformError()
}
