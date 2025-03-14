import { UnsupportedPlatformError } from '@glyph-cat/swiss-army-knife'
import { JSX } from 'react'

export function View(): JSX.Element {
  throw new UnsupportedPlatformError()
}

export function FocusableView(): JSX.Element {
  throw new UnsupportedPlatformError()
}
