import { ReactNode } from 'react'
import { ExperimentalPortal } from '~unstable/experimental-portal'

export default function Example(): ReactNode {
  return (
    <ExperimentalPortal>
      <h1>Hello, world!</h1>
    </ExperimentalPortal>
  )
}
