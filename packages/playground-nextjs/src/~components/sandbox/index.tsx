import { ClientOnly, View } from '@glyph-cat/swiss-army-knife-react'
import { JSX, ReactNode, useEffect, useState } from 'react'
import { SandboxErrorBoundary } from './error-boundary'
import { SandboxSidebar, SIDEBAR_MARGIN, SIDEBAR_WIDTH } from './sidebar'

export interface SandboxContainerProps {
  children?: ReactNode
}

export function SandboxContainer({
  children,
}: SandboxContainerProps): JSX.Element {
  const [isInIframe, setIsInIframe] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsInIframe(window.self !== window.top)
  }, [])
  return (
    <View>
      {!isInIframe && (
        <ClientOnly>
          <SandboxSidebar />
        </ClientOnly>
      )}
      <View
        style={isInIframe ? {} : {
          paddingInlineStart: SIDEBAR_WIDTH + SIDEBAR_MARGIN * 2,
        }}
      >
        <SandboxErrorBoundary>
          {children}
        </SandboxErrorBoundary>
      </View>
    </View>
  )
}
