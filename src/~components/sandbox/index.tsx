import { ClientOnly, View } from '@glyph-cat/swiss-army-knife-react'
import { useRouter } from 'next/router'
import { JSX, ReactNode } from 'react'
import { AppRoute } from '~constants'
import { SandboxErrorBoundary } from './error-boundary'
import styles from './index.module.css'
import { SandboxSidebar, SIDEBAR_MARGIN, SIDEBAR_WIDTH } from './sidebar'

export interface SandboxContainerProps {
  children?: ReactNode
}

export function SandboxContainer(props: SandboxContainerProps): JSX.Element {
  const router = useRouter()
  if (
    !router.pathname.includes(AppRoute.SANDBOX) &&
    !router.asPath.includes(AppRoute.SANDBOX)
  ) {
    return null // Early exit
  }
  return <Content {...props} />
}

function Content({
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
