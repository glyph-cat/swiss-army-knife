import GameStats from 'gamestats.js'
import { JSX, useLayoutEffect, useRef } from 'react'
import { View } from '~core-ui'

export function PerformanceDebugger(): JSX.Element {
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
  return <View ref={gamestatsContainerRef} />
}
