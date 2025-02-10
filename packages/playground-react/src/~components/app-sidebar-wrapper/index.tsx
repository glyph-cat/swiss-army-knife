import { c } from '@glyph-cat/swiss-army-knife'
import { useActionState } from '@glyph-cat/swiss-army-knife-react'
import { useSimpleStateValue } from 'cotton-box-react'
import Link from 'next/link'
import { JSX, ReactNode, useEffect } from 'react'
import { PerformanceDebugger } from '~components/debugging/performance'
import { AppRoute } from '~constants'
import { View } from '~core-ui'
import { APIGetAllSandboxes } from '~services/api/endpoints/sandboxes/get-all'
import { CustomDebugger } from '~services/debugging'
import styles from './index.module.css'

export interface AppSideBarWrapperProps {
  children: ReactNode
}

export function AppSideBarWrapper({
  children,
}: AppSideBarWrapperProps): JSX.Element {
  const shouldShowPerformanceDebugger = useSimpleStateValue(
    CustomDebugger.state,
    (s) => s.showPerformanceDebugger,
  )
  return (
    <View
      className={styles.container}
      style={shouldShowPerformanceDebugger ? {
        gridAutoFlow: 'column',
        gridTemplateColumns: 'auto 1fr',
      } : {}}
    >
      {shouldShowPerformanceDebugger && (
        <>
          <View className={styles.sidebarContainerBase} />
          <View className={c(styles.sidebarContainerBase, styles.sidebarContainer)}>
            <PerformanceDebugger />
            <SidebarContents />
          </View>
        </>
      )}
      <View className={styles.contentContainer}>
        {children}
      </View>
    </View>
  )
}

function SidebarContents(): JSX.Element {
  const [
    sandboxes,
    fetchSandboxes,
    isFetchingSandboxes,
  ] = useActionState<Array<string>>(APIGetAllSandboxes, [])
  useEffect(() => { fetchSandboxes() }, [fetchSandboxes])
  return (
    <ul className={styles.li}>
      {sandboxes.map((sandboxName) => {
        return (
          <li key={sandboxName}>
            <Link href={`${AppRoute.SANDBOX}/${sandboxName}`}>
              {sandboxName}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
