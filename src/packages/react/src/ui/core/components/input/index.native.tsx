import { UnsupportedPlatformError } from '@glyph-cat/foundation'
import { JSX } from 'react'

export function Input(): JSX.Element {
  throw new UnsupportedPlatformError()
}

export function TextArea(): JSX.Element {
  throw new UnsupportedPlatformError()
}
