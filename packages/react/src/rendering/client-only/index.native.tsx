import { ReactNode } from 'react'
import type { ClientOnlyProps } from '.'
import { __setDisplayName } from '../../_internals'

export function ClientOnly({
  children,
}: ClientOnlyProps): ReactNode {
  return children
}

__setDisplayName(ClientOnly)
