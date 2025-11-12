import { Casing, isString, Key, ThemeToken } from '@glyph-cat/swiss-army-knife'
import {
  ButtonBase,
  Input,
  MaterialSymbol,
  useActionState,
  useKeyDownListener,
  View,
} from '@glyph-cat/swiss-army-knife-react'
import { useStateValue } from 'cotton-box-react'
import { fuzzy } from 'fast-fuzzy'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  JSX,
  MouseEvent,
  useCallback,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
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

const STRICT_MODE_ON_COLOR_BG = '#cc440060'
const STRICT_MODE_OFF_COLOR_BG = '#0066ff60'

export const SIDEBAR_MARGIN = 10 // px
export const SIDEBAR_WIDTH = 260 // px

export function SandboxSidebar(): JSX.Element {

  const { localize } = useLocalization()
  const router = useRouter()

  const {
    // showPerformanceDebugger: shouldShowPerformanceDebugger,
    useStrictMode: shouldUseStrictMode,
  } = useStateValue(CustomDebugger.state)

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

  const [searchValue, setSearchValue] = useState('')
  const caseInsensitiveSearchValue = useDeferredValue(searchValue.toLowerCase())

  const [isSearchInputFocused, setSearchInputFocus] = useState(false)
  const searchInputRef = useRef<Input>(null)
  useEffect(() => {
    const target = searchInputRef.current
    if (!target) { return } // Early exit
    const onFocus = () => { setSearchInputFocus(true) }
    const onBlur = () => { setSearchInputFocus(false) }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === Key.Escape) {
        setSearchValue('')
      }
    }
    target.addEventListener('focus', onFocus)
    target.addEventListener('blur', onBlur)
    target.addEventListener('keydown', onKeyDown)
    return () => {
      target.removeEventListener('focus', onFocus)
      target.removeEventListener('blur', onBlur)
      target.removeEventListener('keydown', onKeyDown)
    }
  }, [])
  useKeyDownListener((e) => {
    const target = searchInputRef.current
    if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
      target?.focus()
      e.preventDefault()
    }
  }, [])

  const [isScrolling, setScrollingState] = useState(false)
  useEffect(() => {
    const animationFrameRef = setTimeout(() => {
      setScrollingState(false)
    }, 10)
    return () => { clearTimeout(animationFrameRef) }
  }, [])
  const sidebarContainerRef = useRef<View>(null)
  useEffect(() => {
    const target = sidebarContainerRef.current
    if (!target) { return } // Early exit
    if (isSearchInputFocused) { return } // Early exit
    const onScroll = () => { setScrollingState(true) }
    const onScrollEnd = () => { setScrollingState(false) }
    target.addEventListener('scroll', onScroll)
    target.addEventListener('scrollend', onScrollEnd)
    return () => {
      target.removeEventListener('scroll', onScroll)
      target.removeEventListener('scrollend', onScrollEnd)
    }
  }, [isSearchInputFocused])

  return (
    <View
      ref={sidebarContainerRef}
      style={{
        alignItems: 'start',
        backgroundColor: ThemeToken.appBgColor2,
        border: 'solid 1px #80808020',
        borderRadius: ThemeToken.spacingXL,
        boxShadow: '0px 3px 20px 0px #00000040',
        gridAutoRows: 'min-content',
        height: `calc(100vh - ${SIDEBAR_MARGIN * 2}px)`,
        left: 0,
        margin: SIDEBAR_MARGIN,
        overflow: 'auto',
        padding: ThemeToken.spacingM,
        position: 'fixed',
        top: 0,
        width: SIDEBAR_WIDTH,
        zIndex: 1,
      }}
    >
      <View
        style={{
          marginBottom: ThemeToken.spacingM,
          opacity: isScrolling ? 0.35 : 1,
          position: 'sticky',
          top: 0,
          width: '100%',
          zIndex: 1,
        }}
      >
        <View
          style={{
            backgroundColor: ThemeToken.appBgColor3,
            border: 'solid 1px #80808040',
            borderRadius: ThemeToken.spacingL,
            boxShadow: '0px 3px 10px 0px #00000060',
            overflow: 'hidden',
          }}
        >
          <ButtonBase
            className={styles.buttonBase}
            onClick={CustomDebugger.toggleStrictMode}
            style={{
              backgroundColor: shouldUseStrictMode
                ? STRICT_MODE_ON_COLOR_BG
                : STRICT_MODE_OFF_COLOR_BG,
              height: BUTTON_HEIGHT,
            }}
          >
            {`Strict Mode: ${shouldUseStrictMode ? 'ON' : 'OFF'}`}
          </ButtonBase>
          <ButtonBase
            className={styles.buttonBase}
            onClick={onTriggerSoftReload}
            style={{ height: BUTTON_HEIGHT }}
          >
            {'Soft reload'}
          </ButtonBase>
          <ButtonBase
            className={styles.buttonBase}
            onClick={showCreateSandboxPopup}
            style={{ height: BUTTON_HEIGHT }}
          >
            {'New sandbox'}
          </ButtonBase>
          <View className={styles.separator} />
          <ThemeSelector />
          <View className={styles.separator} />
          <Input
            ref={searchInputRef}
            className={styles.searchInput}
            placeholder={'Search'}
            value={searchValue}
            onChange={useCallback((e) => {
              setSearchValue(e.target.value)
            }, [])}
          />
        </View>
      </View>
      <SidebarContents
        searchValue={caseInsensitiveSearchValue}
      />
    </View>
  )

}

const leadingUnderscorePattern = /^_/

interface SidebarContentsProps {
  searchValue: string
}

function SidebarContents({
  searchValue,
}: SidebarContentsProps): JSX.Element {

  const router = useRouter()

  const [
    sandboxes,
    fetchSandboxes,
    isFetchingSandboxes,
  ] = useActionState<Array<string>>(APIGetAllSandboxes, [])
  useEffect(() => { fetchSandboxes() }, [fetchSandboxes])

  const ulRef = useRef<HTMLUListElement>(null)
  useLayoutEffect(() => {
    if (isFetchingSandboxes) { return } // Early exit
    const target = ulRef.current
    if (!target) { return } // Early exit
    const listElement = document.querySelector('li[data-route-matched="true"]')
    listElement?.scrollIntoView()
  }, [isFetchingSandboxes])

  return (
    <ul
      ref={ulRef}
      className={styles.ul}
    >
      {(searchValue ? sandboxes.filter((sandboxName) => {
        return fuzzy(searchValue, sandboxName) > 0.35
      }) : sandboxes).map((sandboxName) => {
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
            <ButtonBase onClick={onOpenInEditor}>
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
    <View
      style={{
        height: BUTTON_HEIGHT,
        gridAutoColumns: '1fr',
        gridAutoFlow: 'column',
      }}
    >
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
