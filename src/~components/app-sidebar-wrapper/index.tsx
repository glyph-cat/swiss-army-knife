import { c, Casing, isString } from '@glyph-cat/swiss-army-knife'
import {
  ButtonBase as Button,
  ClientOnly,
  MaterialSymbol,
  useActionState,
  View,
} from '@glyph-cat/swiss-army-knife-react'
import { useStateValue } from 'cotton-box-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { JSX, MouseEvent, ReactNode, useCallback, useEffect } from 'react'
import { AppRoute } from '~constants'
import { APICreateSandbox } from '~services/api/endpoints/sandboxes/create'
import { APIGetAllSandboxes } from '~services/api/endpoints/sandboxes/get-all'
import { APIOpenSandboxInEditor } from '~services/api/endpoints/sandboxes/open-in-editor'
import { CustomDebugger } from '~services/debugging'
import styles from './index.module.css'

const BUTTON_HEIGHT = 28 // px

const STRICT_MODE_ON_COLOR = '#c40'
const STRICT_MODE_OFF_COLOR = '#06f'

// TODO: Have a search input for sandboxes

export interface AppSideBarWrapperProps {
  children: ReactNode
}

export function AppSideBarWrapper({
  children,
}: AppSideBarWrapperProps): JSX.Element {

  const {
    showPerformanceDebugger: shouldShowPerformanceDebugger,
    useStrictMode: shouldUseStrictMode,
  } = useStateValue(CustomDebugger.state)

  const router = useRouter()

  const showCreateSandboxPopup = useCallback(async () => {
    const newSandboxName = window.prompt('New sandbox name:')
    if (isString(newSandboxName)) {
      await APICreateSandbox({ name: newSandboxName })
      await APIOpenSandboxInEditor({ sandboxName: newSandboxName })
      router.push(`${AppRoute.SANDBOX}/${newSandboxName}`)
    }
  }, [router])

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
            <View className={styles.buttonsContainer}>
              <ClientOnly>
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
                  {`Strict Mode: ${shouldUseStrictMode ? 'ON' : 'OFF'}`}
                </Button>
              </ClientOnly>
              <Button
                className={styles.buttonBase}
                onClick={CustomDebugger.softReload}
                style={{ height: BUTTON_HEIGHT }}
              >
                {'Soft Reload'}
              </Button>
              <Button
                className={styles.buttonBase}
                onClick={showCreateSandboxPopup}
                style={{ height: BUTTON_HEIGHT }}
              >
                {'Create sandbox'}
              </Button>
            </View>
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
        const onOpenInEditor = async (e: MouseEvent) => {
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
                  size={20}
                  {...(leadingUnderscorePattern.test(sandboxName) ? {
                    name: 'experiment',
                    grade: -25,
                  } : {
                    name: 'code',
                    grade: 200,
                  })}
                />
                <code>
                  {new Casing(sandboxName.replace(leadingUnderscorePattern, '')).toTitleCase()}
                </code>
              </View>
            </Link>
            <Button
              // eslint-disable-next-line react/jsx-no-bind
              onClick={onOpenInEditor}
            >
              <MaterialSymbol name='edit_document' size={16} />
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
