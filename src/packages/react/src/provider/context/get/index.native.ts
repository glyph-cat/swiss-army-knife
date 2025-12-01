import type { IGCContext } from '../..'

/**
 * @internal
 */
export function getContext(
  isMounted: boolean // eslint-disable-line @typescript-eslint/no-unused-vars
): IGCContext {
  return {
    M$initializerStore: {},
    M$isHydrated: true,
  }
}
