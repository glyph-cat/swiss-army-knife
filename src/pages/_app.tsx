import {
  CheckApplePlatformProvider,
  ClientOnly,
  CoreUIProvider,
  MaterialSymbolsOnlineLoader,
  MaterialSymbolsProvider,
  PortalCanvas,
  useIsApplePlatform,
  useKeyChordActivationListener,
  useKeyDownListener,
} from '@glyph-cat/swiss-army-knife-react'
import { useStateValue } from 'cotton-box-react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Fragment, JSX, StrictMode } from 'react'
import { AppSideBar, AppSideBarContainer } from '~components/app-sidebar-wrapper'
import { SandboxErrorBoundary } from '~components/sandbox-error-boundary'
import { ENV, FixedKeyChordKey } from '~constants'
import {
  GlobalInputFocusTracker,
  GlobalKeyChordManager,
  GlobalPortalManager,
} from '~core-ui'
import { CustomDebugger } from '~services/debugging'
import { LocalizationProvider } from '~services/localization'
import { CustomThemeProvider } from '~services/theme'
import '../styles/globals.css'

const SHORTCUT_KEYS_TO_IGNORE: Readonly<Array<string>> = [
  'o', // Open
  'p', // Print
  's', // Save
]

function App({ Component, pageProps }: AppProps): JSX.Element {

  const softReloadKey = useStateValue(CustomDebugger.state, (s) => s.softReloadKey)
  const shouldUseStrictMode = useStateValue(CustomDebugger.state, (s) => s.useStrictMode)
  const StrictModeWrapper = shouldUseStrictMode ? StrictMode : Fragment

  return (
    <StrictModeWrapper key={softReloadKey}>
      <Head>
        <title>{ENV.APP_NAME}</title>
        <meta name='description' content={ENV.APP_DESCRIPTION} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MaterialSymbolsOnlineLoader variants={['rounded']} />
      <MaterialSymbolsProvider variant='rounded' fill={1}>
        <CustomThemeProvider>
          <CoreUIProvider
            inputFocusTracker={GlobalInputFocusTracker}
            keyChordManager={GlobalKeyChordManager}
            portalManager={GlobalPortalManager}
          >
            <LocalizationProvider>
              <ClientOnly>
                <AppSideBar />
              </ClientOnly>
              <AppSideBarContainer>
                <SandboxErrorBoundary>
                  <Component {...pageProps} />
                </SandboxErrorBoundary>
              </AppSideBarContainer>
              <PortalCanvas />
            </LocalizationProvider>
            <CheckApplePlatformProvider>
              <KeyListeners />
            </CheckApplePlatformProvider>
          </CoreUIProvider>
        </CustomThemeProvider>
      </MaterialSymbolsProvider>
    </StrictModeWrapper>
  )
}

export default App

function KeyListeners(): JSX.Element {
  const isAppleOS = useIsApplePlatform()
  useKeyDownListener((e) => {
    const modifierIsKeyActive = isAppleOS ? e.metaKey : e.ctrlKey
    if (modifierIsKeyActive && SHORTCUT_KEYS_TO_IGNORE.includes(e.key)) {
      e.preventDefault()
    }
  }, [isAppleOS])
  useKeyChordActivationListener((e) => {
    if (e.key === FixedKeyChordKey.HIDE_PERFORMANCE_DEBUGGER) {
      CustomDebugger.togglePerformanceDebugger()
    } else if (e.key === FixedKeyChordKey.SOFT_RELOAD) {
      CustomDebugger.softReload()
    }
  }, [], true)
  return null
}
