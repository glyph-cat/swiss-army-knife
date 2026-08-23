import {
  useEffect,
  type DependencyList,
  type EffectCallback,
  type StrictMode, // eslint-disable-line @typescript-eslint/no-unused-vars
} from 'react'

/**
 * Similar to {@link useEffect|`useEffect`}, but the execution is delayed by one frame.
 * This can be useful as an escape hatch to avoid useless double-invocation of
 * API requests when a component mounts due to React {@link StrictMode|`StrictMode`}.
 * @public
 */
export function useDelayedFrameEffect(
  callback: EffectCallback,
  deps: DependencyList,
): void {
  useEffect(() => {
    let cleanup: ReturnType<EffectCallback>
    const animationRef = requestAnimationFrame(() => {
      cleanup = callback()
    })
    return () => {
      cancelAnimationFrame(animationRef)
      cleanup?.()
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}
