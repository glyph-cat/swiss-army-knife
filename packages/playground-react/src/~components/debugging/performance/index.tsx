import { useSimpleStateValue } from 'cotton-box-react'
import GameStats from 'gamestats.js'
import { JSX, useLayoutEffect, useRef } from 'react'
import { View } from '~core-ui'
import { CustomDebugger } from '~services/debugging'
import styles from './index.module.css'

const STRICT_MODE_INDICATOR_HEIGHT = 28 // px

export const STRICT_MODE_ON_COLOR = '#c40'
export const STRICT_MODE_OFF_COLOR = '#06f'

export function PerformanceDebugger(): JSX.Element {

  const shouldUseStrictMode = useSimpleStateValue(CustomDebugger.state, (s) => s.useStrictMode)

  const gamestatsContainerRef = useRef<View>(null)
  useLayoutEffect(() => {
    let lastAnimationFrame: number
    const stats = new GameStats({ autoPlace: false })
    stats.dom.style.position = 'relative'
    gamestatsContainerRef.current.append(stats.dom)
    const run = () => {
      stats.begin()
      requestAnimationFrame(run)
    }
    requestAnimationFrame(run)
    return () => {
      cancelAnimationFrame(lastAnimationFrame)
      stats.end()
      stats.dom.remove()
    }
  }, [])

  return (
    <View className={styles.container}>
      <View ref={gamestatsContainerRef} />
      <button
        onClick={CustomDebugger.toggleStrictMode}
        className={styles.strictModeButton}
        style={{
          backgroundColor: shouldUseStrictMode ? '#c40' : '#06f',
          height: STRICT_MODE_INDICATOR_HEIGHT,
        }}
      >
        Strict Mode: {shouldUseStrictMode ? 'ON' : 'OFF'}
      </button>
    </View>
  )
}
