import type { IGCContext } from '../..'

/**
 * @internal
 */
export function getContext(isMounted: boolean): IGCContext {
  return {
    M$initializerStore: {},
    M$isHydrated: isMounted,
  }
}
