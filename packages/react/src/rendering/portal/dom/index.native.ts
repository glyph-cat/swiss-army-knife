import { UnsupportedPlatformError } from '@glyph-cat/swiss-army-knife'
import { JSX } from 'react'
import { DOMPortalProps } from '.'

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DOMPortal(props: DOMPortalProps): JSX.Element {
  throw new UnsupportedPlatformError()
}
