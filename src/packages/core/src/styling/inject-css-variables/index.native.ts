import { UnsupportedPlatformError } from '../../error'

export function injectInlineCSSVariables(): void {
  throw new UnsupportedPlatformError()
}

export function injectCSSVariables(): void {
  throw new UnsupportedPlatformError()
}
