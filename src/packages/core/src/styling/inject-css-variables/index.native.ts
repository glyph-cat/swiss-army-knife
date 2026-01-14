import { UnsupportedPlatformError } from '@glyph-cat/foundation'

export function injectInlineCSSVariables(): void {
  throw new UnsupportedPlatformError()
}

export function injectCSSVariables(): void {
  throw new UnsupportedPlatformError()
}
