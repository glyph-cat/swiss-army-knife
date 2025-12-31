import { JSX, ReactNode } from 'react'
import { __setDisplayName, useTestProbe } from '../../_internals'
import { useHydrationState } from '../../hooks/deferral/hydration'

/**
 * @public
 */
export interface ClientOnlyProps {
  children?: ReactNode
}

/**
 * Circumvents hydration mismatch error in server-side rendered projects by deferring
 * the children from being rendered after one cycle.
 *
 * Note: This might not be a good practice, please use sparingly.
 *
 * To _always_ defer children from rendering by one cycle,
 * please use {@link DeferRendering|`DeferRendering`} instead.
 *
 * @see https://github.com/vercel/next.js/discussions/17443#discussioncomment-637879
 * @public
 */
export function ClientOnly({
  children,
}: ClientOnlyProps): JSX.Element {
  useTestProbe(ClientOnly.name) // KIV: Make sure this gets removed after bundling
  const isHydrated = useHydrationState()
  return (isHydrated ? children : null) as JSX.Element
}

__setDisplayName(ClientOnly)
