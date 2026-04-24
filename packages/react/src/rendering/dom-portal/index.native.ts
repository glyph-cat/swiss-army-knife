import { UnsupportedPlatformError } from '@glyph-cat/foundation'
import { JSX } from 'react'
import { DOMPortalProps } from '.'

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DOMPortal(props: DOMPortalProps): JSX.Element {
  throw new UnsupportedPlatformError()
}
