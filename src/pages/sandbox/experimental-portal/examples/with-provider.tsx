import { ReactNode } from 'react'
import { ExperimentalPortal, ExperimentalPortalProvider } from '~unstable/experimental-portal'

export default function Example(): ReactNode {
  return (
    <>
      <ExperimentalPortalProvider>
        <ExperimentalPortal>
          <h1>Hello, world!</h1>
        </ExperimentalPortal>
      </ExperimentalPortalProvider>
    </>
  )
}
