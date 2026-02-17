import { UnsupportedPlatformError } from '@glyph-cat/foundation'

export function renderToString(): string {
  throw new UnsupportedPlatformError()
}
