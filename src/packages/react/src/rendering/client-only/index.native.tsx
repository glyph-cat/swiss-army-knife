import { JSX } from 'react'
import { __setDisplayName } from '../../_internals'
import type { ClientOnlyProps } from '.'

export function ClientOnly({
  children,
}: ClientOnlyProps): JSX.Element {
  return children as JSX.Element
}

__setDisplayName(ClientOnly)
