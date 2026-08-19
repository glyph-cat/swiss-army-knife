import { UnsupportedPlatformError } from '@glyph-cat/foundation'
import { ReactNode } from 'react'
import { DOMPortalProps } from '.'

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DOMPortal(props: DOMPortalProps): ReactNode {
  throw new UnsupportedPlatformError()
}
