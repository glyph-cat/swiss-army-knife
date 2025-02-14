import { vh, vw } from '@glyph-cat/swiss-army-knife'
import { CheckApplePlatformProvider, useIsApplePlatform } from '@glyph-cat/swiss-army-knife-react'
import { useSimpleStateValue } from 'cotton-box-react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Fragment, JSX, StrictMode } from 'react'
import { AppSideBarWrapper } from '~components/app-sidebar-wrapper'
import { ENV, FixedKeyChordKey } from '~constants'
import { FocusRoot, useKeyChordActivationListener, useKeyDownListener, View } from '~core-ui'
import { CustomDebugger } from '~services/debugging'
import '../styles/globals.css'

const SHORTCUT_KEYS_TO_IGNORE: Readonly<Array<string>> = [
  'o', // Open
  'p', // Print
  's', // Save
]

function App({ Component, pageProps }: AppProps): JSX.Element {

  const softReloadKey = useSimpleStateValue(CustomDebugger.state, (s) => s.softReloadKey)
  const shouldUseStrictMode = useSimpleStateValue(CustomDebugger.state, (s) => s.useStrictMode)
  const StrictModeWrapper = shouldUseStrictMode ? StrictMode : Fragment

  return (
    <StrictModeWrapper key={softReloadKey}>
      <Head>
        <title>{ENV.APP_NAME}</title>
        <meta name='description' content={ENV.APP_DESCRIPTION} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <FocusRoot>
        <AppSideBarWrapper>
          <Component {...pageProps} />
        </AppSideBarWrapper>
        <CheckApplePlatformProvider>
          <KeyListeners />
        </CheckApplePlatformProvider>
        <RestartServerCover />
      </FocusRoot>
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
    } else if (e.key === FixedKeyChordKey.RESTART_SERVER) {
      CustomDebugger.restartServer()
    } else if (e.key === FixedKeyChordKey.SOFT_RELOAD) {
      CustomDebugger.softReload()
    }
  }, [], true, true)
  return null
}

function RestartServerCover(): JSX.Element {
  const isRestartingServer = useSimpleStateValue(CustomDebugger.state, (s) => s.isRestartingServer)
  return isRestartingServer && (
    <View style={{
      backgroundColor: '#80808040',
      height: vh(100),
      position: 'fixed',
      top: 0,
      width: vw(100),
      placeItems: 'center',
      zIndex: 1,
    }}>
      <span style={{ fontSize: '18pt' }}>
        {'Restarting server, please wait...'}
      </span>
    </View>
  )
}
