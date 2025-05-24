import { Casing, isString } from '@glyph-cat/swiss-army-knife'
import { ButtonBase, MaterialSymbol, useActionState, View } from '@glyph-cat/swiss-army-knife-react'
import { useStateValue } from 'cotton-box-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { JSX, MouseEvent, ReactNode, useCallback, useEffect } from 'react'
import { AppRoute } from '~constants'
import { APICreateSandbox } from '~services/api/endpoints/sandboxes/create'
import { APIGetAllSandboxes } from '~services/api/endpoints/sandboxes/get-all'
import { APIOpenSandboxInEditor } from '~services/api/endpoints/sandboxes/open-in-editor'
import { CustomDebugger } from '~services/debugging'
import { useLocalization } from '~services/localization'
import { setAutoTheme, setDarkTheme, setLightTheme, ThemeState } from '~services/theme'
import { ThemeId } from '~services/theme/abstractions'
import styles from './index.module.css'

const BUTTON_HEIGHT = 28 // px

const SIDEBAR_WIDTH = 240 // px

const STRICT_MODE_ON_COLOR = '#c40'
const STRICT_MODE_OFF_COLOR = '#06f'

// TODO: Have a search input for sandboxes

export interface AppSideBarContainerProps {
  children?: ReactNode
}

export function AppSideBarContainer({
  children,
}: AppSideBarContainerProps): JSX.Element {
  const shouldShowPerformanceDebugger = useStateValue(
    CustomDebugger.state,
    (s) => s.showPerformanceDebugger,
  )
  return (
    <View style={shouldShowPerformanceDebugger ? {
      left: SIDEBAR_WIDTH,
      padding: 10,
      width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
    } : {}}>
      {children}
    </View>
  )
}

export function AppSideBar(): JSX.Element {

  const { localize } = useLocalization()

  const {
    showPerformanceDebugger: shouldShowPerformanceDebugger,
    useStrictMode: shouldUseStrictMode,
  } = useStateValue(CustomDebugger.state)

  const router = useRouter()

  const onTriggerSoftReload = useCallback((e: MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      CustomDebugger.testForMemoryLeak()
    } else {
      CustomDebugger.softReload()
    }
  }, [])

  const showCreateSandboxPopup = useCallback(async () => {
    const newSandboxName = window.prompt('New sandbox name:')
    if (isString(newSandboxName)) {
      await APICreateSandbox({ name: newSandboxName })
      await APIOpenSandboxInEditor({ sandboxName: newSandboxName })
      router.push(`${AppRoute.SANDBOX}/${newSandboxName}`)
    }
  }, [router])

  return shouldShowPerformanceDebugger && (
    <View
      className={styles.sidebarContainer}
      style={{ width: SIDEBAR_WIDTH }}
    >
      <View className={styles.buttonsContainer}>
        <ButtonBase
          className={styles.buttonBase}
          style={{
            backgroundColor: shouldUseStrictMode
              ? STRICT_MODE_ON_COLOR
              : STRICT_MODE_OFF_COLOR,
            color: '#ffffff',
            height: BUTTON_HEIGHT,
            textTransform: 'uppercase',
          }}
          onClick={CustomDebugger.toggleStrictMode}
        >
          {`Strict Mode: ${localize(shouldUseStrictMode ? 'ON' : 'OFF')}`}
        </ButtonBase>
        <ButtonBase
          className={styles.buttonBase}
          onClick={onTriggerSoftReload}
          style={{ height: BUTTON_HEIGHT }}
        >
          {localize('SOFT_RELOAD')}
        </ButtonBase>
        <ButtonBase
          className={styles.buttonBase}
          onClick={showCreateSandboxPopup}
          style={{ height: BUTTON_HEIGHT }}
        >
          {localize('CREATE_NEW_SANDBOX')}
        </ButtonBase>
        <ThemeSelector />
      </View>
      <SidebarContents />
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
            <ButtonBase
              // eslint-disable-next-line react/jsx-no-bind
              onClick={onOpenInEditor}
            >
              <MaterialSymbol name='edit_document' size={16} />
            </ButtonBase>
          </li>
        )
      })}
    </ul>
  )
}

function ThemeSelector(): JSX.Element {

  const themeState = useStateValue(ThemeState)
  const { localize } = useLocalization()

  return (
    <View style={{
      height: BUTTON_HEIGHT,
      gridAutoColumns: '1fr',
      gridAutoFlow: 'column',
    }}>
      <ButtonBase className={styles.buttonBase} onClick={setAutoTheme}>
        {decorateSelection(
          localize('AUTOMATIC'),
          themeState.auto
        )}
      </ButtonBase>
      <ButtonBase className={styles.buttonBase} onClick={setLightTheme}>
        {decorateSelection(
          localize('THEME_LIGHT'),
          !themeState.auto && themeState.id === ThemeId.DEFAULT_LIGHT
        )}
      </ButtonBase>
      <ButtonBase className={styles.buttonBase} onClick={setDarkTheme}>
        {decorateSelection(
          localize('THEME_DARK'),
          !themeState.auto && themeState.id === ThemeId.DEFAULT_DARK
        )}
      </ButtonBase>
    </View>
  )
}
function decorateSelection(text: string, selected: boolean): string {
  return selected ? `[ ${text} ]` : text
}
