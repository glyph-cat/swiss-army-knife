import { JSX, Key } from 'react'
import { createPortal } from 'react-dom'
import { PortalProps } from '../factory'

/**
 * @public
 */
export interface DOMPortalProps extends PortalProps {
  /**
   * @defaultValue `document.body`
   */
  container?: Element | DocumentFragment
  portalKey?: Key
}

/**
 * @example
 * import { DOMPortal as Portal } from '@glyph-cat/swiss-army-knife-react'
 * function Example(): JSX.Element {
 *   return (
 *     <Portal>
 *       <h1>Hello, world!</h1>
 *     </Portal>
 *   )
 * }
 * @public
 */
export function DOMPortal({
  children,
  container,
  portalKey,
}: DOMPortalProps): JSX.Element {
  return createPortal(children, container ?? document.body, portalKey)
}
