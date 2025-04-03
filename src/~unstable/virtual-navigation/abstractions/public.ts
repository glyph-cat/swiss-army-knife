import { CleanupFunction } from '@glyph-cat/swiss-army-knife'

/**
 * @public
 */
export type CoreNavigationId = string

/**
 * @public
 */
export interface ICoreNavigationBranchContext {
  setFocus(id: CoreNavigationId): void
}

/**
 * @public
 */
export interface ICoreNavigationStackContext {
  insert(): CleanupFunction
}

/**
 * @public
 */
export interface ICoreNavigation {
  branch?: ICoreNavigationBranchContext
  stack?: ICoreNavigationStackContext
}
