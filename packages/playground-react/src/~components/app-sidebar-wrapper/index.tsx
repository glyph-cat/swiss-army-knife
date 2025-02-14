import { c } from '@glyph-cat/swiss-army-knife'
import { useActionState } from '@glyph-cat/swiss-army-knife-react'
import { useSimpleStateValue } from 'cotton-box-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { JSX, MouseEvent, ReactNode, useEffect } from 'react'
import { PerformanceDebugger } from '~components/debugging/performance'
import { AppRoute } from '~constants'
import { Button, FocusLayer, View } from '~core-ui'
import { APIGetAllSandboxes } from '~services/api/endpoints/sandboxes/get-all'
import { APIOpenSandboxInEditor } from '~services/api/endpoints/sandboxes/open-in-editor'
import { CustomDebugger } from '~services/debugging'
import { MaterialSymbol } from '~unstable/material-symbols'
import styles from './index.module.css'

const BUTTON_HEIGHT = 28 // px

const STRICT_MODE_ON_COLOR = '#c40'
const STRICT_MODE_OFF_COLOR = '#06f'

// TODO: Search sandbox
// TODO: Create sandbox

export interface AppSideBarWrapperProps {
  children: ReactNode
}

export function AppSideBarWrapper({
  children,
}: AppSideBarWrapperProps): JSX.Element {
  const {
    showPerformanceDebugger: shouldShowPerformanceDebugger,
    useStrictMode: shouldUseStrictMode,
  } = useSimpleStateValue(CustomDebugger.state)
  return (
    <View
      className={styles.container}
      style={shouldShowPerformanceDebugger ? {
        gridAutoFlow: 'column',
        gridTemplateColumns: 'auto 1fr',
      } : {}}
    >
      {shouldShowPerformanceDebugger && (
        <FocusLayer ignoreSiblings>
          <View className={styles.sidebarContainerBase} />
          <View className={c(styles.sidebarContainerBase, styles.sidebarContainer)}>
            <View style={{ gridTemplateColumns: 'auto 1fr' }}>
              <PerformanceDebugger />
              <View className={styles.buttonsContainer}>
                <Button
                  className={styles.buttonBase}
                  style={{
                    backgroundColor: shouldUseStrictMode
                      ? STRICT_MODE_ON_COLOR
                      : STRICT_MODE_OFF_COLOR,
                    height: BUTTON_HEIGHT,
                  }}
                  onClick={CustomDebugger.toggleStrictMode}
                >
                  Strict Mode: {shouldUseStrictMode ? 'ON' : 'OFF'}
                </Button>
                <Button
                  className={styles.buttonBase}
                  onClick={CustomDebugger.restartServer}
                  style={{ height: BUTTON_HEIGHT }}
                >
                  Restart server
                </Button>
              </View>
            </View>
            <SidebarContents />
          </View>
        </FocusLayer>
      )}
      <FocusLayer>
        <View className={styles.contentContainer}>
          {children}
        </View>
      </FocusLayer>
    </View>
  )
}

const leadingUnderscorePattern = /^_/

function SidebarContents(): JSX.Element {

  const router = useRouter()

  const [
    sandboxes,
    fetchSandboxes,
    isFetchingSandboxes,
  ] = useActionState<Array<string>>(APIGetAllSandboxes, [])
  useEffect(() => { fetchSandboxes() }, [fetchSandboxes])

  return (
    <ul className={styles.ul}>
      {sandboxes.map((sandboxName) => {
        const path = `${AppRoute.SANDBOX}/${sandboxName}`
        const onOpenInCode = async (e: MouseEvent) => {
          await APIOpenSandboxInEditor({ sandboxName })
          e.preventDefault()
        }
        return (
          <li
            key={sandboxName}
            {...(router.asPath === path) ? { 'data-route-matched': true } : {}}
          >
            <Link href={path}>
              <View>
                <MaterialSymbol
                  {...(leadingUnderscorePattern.test(sandboxName) ? {
                    name: 'experiment',
                    grade: -25,
                  } : {
                    name: 'code',
                    grade: 200,
                  })}
                />
                <code>{sandboxName.replace(leadingUnderscorePattern, '')}</code>
              </View>
            </Link>
            <Button
              // eslint-disable-next-line react/jsx-no-bind
              onClick={onOpenInCode}
            >
              <MaterialSymbol name='edit_document' size={16} />
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
