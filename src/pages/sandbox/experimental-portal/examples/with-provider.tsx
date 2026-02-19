import { ExperimentalPortal, ExperimentalPortalProvider } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode } from 'react'

export default function Example(): ReactNode {
  return (
    <>
      <ExperimentalPortalProvider container={<code />}>
        <ExperimentalPortal>
          <h1>Hello, world!</h1>
        </ExperimentalPortal>
      </ExperimentalPortalProvider>
    </>
  )
}
