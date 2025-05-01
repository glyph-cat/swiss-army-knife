import GameStats from 'gamestats.js'
import { useInsertionEffect } from 'react'

export function useGameStats(enabled: boolean = true): void {
  useInsertionEffect(() => {
    if (!enabled) { return } // Early exit
    let lastAnimationFrame: number
    const stats = new GameStats({ autoPlace: false })
    stats.dom.style.top = 'calc(100vh - 150px)'
    stats.dom.style.left = 'calc(100vw - 100px)'
    stats.dom.style.zIndex = String(1)
    document.body.append(stats.dom)
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
  }, [enabled])
}
