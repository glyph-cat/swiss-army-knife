import { Nullable } from '@glyph-cat/foundation'
import { Key, ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * @public
 */
export interface PortalProps {
  /**
   * @defaultValue `undefined`
   */
  children?: ReactNode
  /**
   * @defaultValue [`document.body`](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)
   */
  container?: Element | DocumentFragment
  /**
   * @defaultValue `undefined`
   */
  portalKey?: Nullable<Key>
}

/**
 * @example
 * function Example(): ReactNode {
 *   return (
 *     <Portal>
 *       <h1>Hello, world!</h1>
 *     </Portal>
 *   )
 * }
 * @public
 */
export function Portal({
  children,
  container,
  portalKey,
}: PortalProps): ReactNode {
  return createPortal(children, container ?? document.body, portalKey)
}
