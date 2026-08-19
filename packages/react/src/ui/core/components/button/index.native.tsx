import { UnsupportedPlatformError } from '@glyph-cat/foundation'
import { ReactNode } from 'react'

export function ButtonBase(): ReactNode {
  throw new UnsupportedPlatformError()
}
