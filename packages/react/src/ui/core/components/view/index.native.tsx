import { UnsupportedPlatformError } from '@glyph-cat/foundation'
import { ReactNode } from 'react'

export function View(): ReactNode {
  throw new UnsupportedPlatformError()
}

// export function FocusableView(): ReactNode {
//   throw new UnsupportedPlatformError()
// }
