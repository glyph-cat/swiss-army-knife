import { useTestProbe } from '@glyph-cat/react-test-utils'
import { ReactNode } from 'react'
import { __setDisplayName } from '../../_internals'
import { useMountedState } from '../../hooks/deferral/mounted'

/**
 * @public
 */
export interface DeferRenderingProps {
  children?: ReactNode
}

/**
 * Defers children from rendering by one cycle.
 * @public
 */
export function DeferRendering({
  children,
}: DeferRenderingProps): ReactNode {
  useTestProbe(DeferRendering)
  const isMounted = useMountedState()
  return isMounted ? children : null
}

__setDisplayName(DeferRendering)
