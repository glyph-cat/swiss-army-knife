import { UnsupportedPlatformError } from '@glyph-cat/foundation'
import { JSX } from 'react'

export function View(): JSX.Element {
  throw new UnsupportedPlatformError()
}

// export function FocusableView(): JSX.Element {
//   throw new UnsupportedPlatformError()
// }
