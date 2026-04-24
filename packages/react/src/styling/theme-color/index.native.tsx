import { UnsupportedPlatformError } from '@glyph-cat/foundation'
import { JSX } from 'react'

export function ThemeColor(): JSX.Element {
  throw new UnsupportedPlatformError()
}

export function useThemeColor(): void {
  throw new UnsupportedPlatformError()
}
