import { useSimpleStateValue } from 'cotton-box-react'
import { DependencyList, useEffect } from 'react'
import { useIsApplePlatform } from '../../platform-checking'
import { useCoreUIContext } from '../context'
import { useCheckInputFocus } from '../input-focus'
import { useLayeredFocusState } from '../layered-focus'

const EVENT_KEYDOWN = 'keydown'
const EVENT_KEYUP = 'keyup'

export function useKeyChordActivationListener(
  callback: (e: KeyboardEvent) => void,
  dependencies: DependencyList,
  enabled = true,
  ignoreLayerFocus = false,
): void {
  const { keyChordManager } = useCoreUIContext()
  const isAnyInputFocused = useCheckInputFocus()
  const isAppleOS = useIsApplePlatform()
  const [isFocused] = useLayeredFocusState()
  useEffect(() => {
    if (!enabled || isAnyInputFocused) { return } // Early exit
    if (!isFocused && !ignoreLayerFocus) { return } // Early exit
    let chordTimestamp: number
    let releaseKeyChord: ReturnType<typeof keyChordManager.occupyKeyChord> = null
    const onKeyDown = (e: KeyboardEvent) => {
      const now = performance.now()
      const modifierIsKeyActive = isAppleOS ? e.metaKey : e.ctrlKey
      if (modifierIsKeyActive && e.key === keyChordManager.activationKey) {
        chordTimestamp = now
        e.preventDefault()
        releaseKeyChord = keyChordManager.occupyKeyChord()
        setTimeout(releaseKeyChord, keyChordManager.timeout)
      } else if (now - chordTimestamp < keyChordManager.timeout) {
        callback(e)
        releaseKeyChord()
      }
    }
    window.addEventListener(EVENT_KEYDOWN, onKeyDown)
    return () => {
      releaseKeyChord?.()
      window.removeEventListener(EVENT_KEYDOWN, onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ignoreLayerFocus, isAnyInputFocused, isAppleOS, isFocused, keyChordManager, ...dependencies])
}

export function useKeyDownListener(
  onKeyDown: (e: KeyboardEvent) => void,
  dependencies: DependencyList,
  enabled = true,
  ignoreLayerFocus = false,
): void {
  const { keyChordManager } = useCoreUIContext()
  const isAnyInputFocused = useCheckInputFocus()
  const isOccupiedByKeyChord = useSimpleStateValue(keyChordManager.isOccupied)
  const [isFocused] = useLayeredFocusState()
  useEffect(() => {
    if (!enabled || isAnyInputFocused || isOccupiedByKeyChord) { return } // Early exit
    if (!isFocused && !ignoreLayerFocus) { return } // Early exit
    window.addEventListener(EVENT_KEYDOWN, onKeyDown)
    return () => { window.removeEventListener(EVENT_KEYDOWN, onKeyDown) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ignoreLayerFocus, isAnyInputFocused, isFocused, isOccupiedByKeyChord, ...dependencies])
}

export function useKeyUpListener(
  onKeyUp: (e: KeyboardEvent) => void,
  dependencies: DependencyList,
  enabled = true,
  ignoreLayerFocus = false,
): void {
  const { keyChordManager } = useCoreUIContext()
  const isAnyInputFocused = useCheckInputFocus()
  const isOccupiedByKeyChord = useSimpleStateValue(keyChordManager.isOccupied)
  const [isFocused] = useLayeredFocusState()
  useEffect(() => {
    if (!enabled || isAnyInputFocused || isOccupiedByKeyChord) { return } // Early exit
    if (!isFocused && !ignoreLayerFocus) { return } // Early exit
    window.addEventListener(EVENT_KEYUP, onKeyUp)
    return () => { window.removeEventListener(EVENT_KEYUP, onKeyUp) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ignoreLayerFocus, isAnyInputFocused, isFocused, isOccupiedByKeyChord, ...dependencies])
}
