import { UnsupportedPlatformError } from '@glyph-cat/foundation'
import { ReactNode } from 'react'

export function ThemeColor(): ReactNode {
  throw new UnsupportedPlatformError()
}

export function useThemeColor(): void {
  throw new UnsupportedPlatformError()
}
