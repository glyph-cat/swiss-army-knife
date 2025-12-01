import { JSX, ReactNode } from 'react'
import { __setDisplayName } from '../../_internals'
import { useMountedState } from '../../hooks/deferral/mounted'

/**
 * @public
 */
export interface DeferProps {
  children?: ReactNode
}

/**
 * Defers children from rendering by one cycle.
 * @public
 */
export function Defer({
  children,
}: DeferProps): JSX.Element {
  const isMounted = useMountedState()
  return (isMounted ? children : null) as JSX.Element
}

__setDisplayName(Defer)
