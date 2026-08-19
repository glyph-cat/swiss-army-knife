import { UnsupportedPlatformError } from '@glyph-cat/foundation'
import { ReactNode } from 'react'

export function Surface(): ReactNode {
  throw new UnsupportedPlatformError()
}
