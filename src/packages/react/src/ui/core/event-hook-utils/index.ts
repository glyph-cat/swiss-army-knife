import { Nullable } from '@glyph-cat/foundation'
import { KeyChordManager } from '@glyph-cat/swiss-army-knife'
import { useSimpleStateValue } from 'cotton-box-react'
import { DependencyList, useEffect } from 'react'
import { useIsApplePlatform } from '../../../platform-checking'
import { useCoreUIContext } from '../context'
import { useCheckInputFocus } from '../input-focus'
import { useCoreNavigationBranch } from '../navigation/branch'
import { useCoreNavigationStack } from '../navigation/stack'

const EVENT_KEYDOWN = 'keydown'
const EVENT_KEYUP = 'keyup'

/**
 * @public
 */
export function useKeyChordActivationListener(
  callback: (e: KeyboardEvent) => void,
  dependencies: DependencyList,
  enabled = true,
): void {
  const { keyChordManager } = useCoreUIContext()
  const isAnyInputFocused = useCheckInputFocus()
  const isAppleOS = useIsApplePlatform()
  const navStack = useCoreNavigationStack()
  const navBranch = useCoreNavigationBranch()
  const isFocused = navStack.isFocused && navBranch.isFocused
  useEffect(() => {
    if (!enabled || isAnyInputFocused) { return } // Early exit
    if (!isFocused) { return } // Early exit
    let chordTimestamp: number
    let releaseKeyChord: Nullable<ReturnType<KeyChordManager['occupyKeyChord']>> = null
    const onKeyDown = (e: KeyboardEvent) => {
      const now = performance.now()
      const modifierIsKeyActive = isAppleOS ? e.metaKey : e.ctrlKey
      if (keyChordManager) {
        if (modifierIsKeyActive && e.key === keyChordManager.activationKey) {
          chordTimestamp = now
          e.preventDefault()
          releaseKeyChord = keyChordManager.occupyKeyChord()
          setTimeout(releaseKeyChord, keyChordManager.timeout)
        } else if (now - chordTimestamp < keyChordManager.timeout) {
          callback(e)
          releaseKeyChord?.()
        }
      }
    }
    window.addEventListener(EVENT_KEYDOWN, onKeyDown)
    return () => {
      releaseKeyChord?.()
      window.removeEventListener(EVENT_KEYDOWN, onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, isAnyInputFocused, isAppleOS, isFocused, keyChordManager, ...dependencies])
}

/**
 * @public
 */
export function useKeyDownListener(
  onKeyDown: (e: KeyboardEvent) => void,
  dependencies: DependencyList,
  enabled = true,
  ignoreLayerFocus = false, // TODO: rename `ignoreNavigationFocus`?
): void {
  const { keyChordManager } = useCoreUIContext()
  if (!keyChordManager) {
    throw new Error('`useKeyDownListener` requires `keyChordManager` to be provided in context via <CoreUIProvider>')
  }
  const isAnyInputFocused = useCheckInputFocus()
  const isOccupiedByKeyChord = useSimpleStateValue(keyChordManager.isOccupied)
  const navStack = useCoreNavigationStack()
  const navBranch = useCoreNavigationBranch()
  const isFocused = navStack.isFocused && navBranch.isFocused
  useEffect(() => {
    if (!enabled || isAnyInputFocused || isOccupiedByKeyChord) { return } // Early exit
    if (!isFocused && !ignoreLayerFocus) { return } // Early exit
    window.addEventListener(EVENT_KEYDOWN, onKeyDown)
    return () => { window.removeEventListener(EVENT_KEYDOWN, onKeyDown) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ignoreLayerFocus, isAnyInputFocused, isFocused, isOccupiedByKeyChord, ...dependencies])
}

/**
 * @public
 */
export function useKeyUpListener(
  onKeyUp: (e: KeyboardEvent) => void,
  dependencies: DependencyList,
  enabled = true,
  ignoreLayerFocus = false, // TODO: rename `ignoreNavigationFocus`?
): void {
  const { keyChordManager } = useCoreUIContext()
  if (!keyChordManager) {
    throw new Error('`useKeyDownListener` requires `keyChordManager` to be provided in context via <CoreUIProvider>')
  }
  const isAnyInputFocused = useCheckInputFocus()
  const isOccupiedByKeyChord = useSimpleStateValue(keyChordManager.isOccupied)
  const navStack = useCoreNavigationStack()
  const navBranch = useCoreNavigationBranch()
  const isFocused = navStack.isFocused && navBranch.isFocused
  useEffect(() => {
    if (!enabled || isAnyInputFocused || isOccupiedByKeyChord) { return } // Early exit
    if (!isFocused && !ignoreLayerFocus) { return } // Early exit
    window.addEventListener(EVENT_KEYUP, onKeyUp)
    return () => { window.removeEventListener(EVENT_KEYUP, onKeyUp) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ignoreLayerFocus, isAnyInputFocused, isFocused, isOccupiedByKeyChord, ...dependencies])
}
