import { UnsupportedPlatformError } from '@glyph-cat/swiss-army-knife'

export function renderToString(): string {
  throw new UnsupportedPlatformError()
}
