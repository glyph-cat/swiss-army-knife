import { Key, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { __setDisplayName } from '../../_internals'

/**
 * @public
 */
export interface DOMPortalProps {
  children: ReactNode
  /**
   * @defaultValue `document.body`
   */
  container?: Element | DocumentFragment
  portalKey?: Key
}

/**
 * @example
 * import { DOMPortal as Portal } from '@glyph-cat/swiss-army-knife-react'
 * function Example(): ReactNode {
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
}: DOMPortalProps): ReactNode {
  return createPortal(children, container ?? document.body, portalKey)
}

__setDisplayName(DOMPortal)
