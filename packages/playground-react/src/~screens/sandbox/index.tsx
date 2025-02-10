import { JSX, lazy, Suspense } from 'react'

export interface SandboxScreenProps {
  name: string
}

function SandboxScreen({ name: sandboxName }: SandboxScreenProps): JSX.Element {
  const SandboxComponent = lazy(() => import(`~sandboxes/${sandboxName}`))
  return (
    <Suspense>
      <SandboxComponent />
    </Suspense>
  )
}

export default SandboxScreen
