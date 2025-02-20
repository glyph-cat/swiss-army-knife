import { UnsupportedPlatformError } from '@glyph-cat/swiss-army-knife'
import { CSSProperties } from 'react'
import { PseudoClasses } from './abstractions'

/**
 * @public
 */
export function useStyles<Key extends string>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  styles: Record<Key, CSSProperties | Record<PseudoClasses, CSSProperties>>
): Record<Key, string> {
  throw new UnsupportedPlatformError()
}
