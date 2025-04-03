import { CleanupFunction } from '@glyph-cat/swiss-army-knife'

/**
 * @public
 */
export type VirtualNavigationId = string

/**
 * @public
 */
export interface IVirtualNavigationBranchContext {
  setFocus(id: VirtualNavigationId): void
}

/**
 * @public
 */
export interface IVirtualNavigationStackContext {
  insert(): CleanupFunction
}

/**
 * @public
 */
export interface IVirtualNavigation {
  branch?: IVirtualNavigationBranchContext
  stack?: IVirtualNavigationStackContext
}
