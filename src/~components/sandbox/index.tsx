import { ClientOnly, View } from '@glyph-cat/swiss-army-knife-react'
import { JSX, ReactNode } from 'react'
import { SandboxErrorBoundary } from './error-boundary'
import { SandboxSidebar, SIDEBAR_MARGIN, SIDEBAR_WIDTH } from './sidebar'

export interface SandboxContainerProps {
  children?: ReactNode
}

export function SandboxContainer({
  children,
}: SandboxContainerProps): JSX.Element {
  return (
    <View>
      <ClientOnly>
        <SandboxSidebar />
      </ClientOnly>
      <View
        style={{
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
