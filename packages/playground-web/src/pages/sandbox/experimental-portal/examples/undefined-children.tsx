import { ReactNode } from 'react'
import { ExperimentalPortal } from '~unstable/experimental-portal'

export default function Example(): ReactNode {
  return (
    <ExperimentalPortal>
      {undefined}
    </ExperimentalPortal>
  )
}
