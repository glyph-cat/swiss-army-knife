import { JSX } from 'react'
import { GCProvider } from '.'

test('.', () => {
  function Temp(): JSX.Element {
    return (
      <GCProvider>
        {/* ... */}
      </GCProvider>
    )
  }
})
