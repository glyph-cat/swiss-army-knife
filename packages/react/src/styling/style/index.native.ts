import { UnsupportedPlatformError } from '@glyph-cat/foundation'
import { ReactNode } from 'react'
import { StyleProps } from './abstractions'

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Style(props: StyleProps): ReactNode {
  throw new UnsupportedPlatformError()
}

export * from './abstractions/public'
