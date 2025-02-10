import { KeyChordManager } from '@glyph-cat/swiss-army-knife'
import { useSimpleStateValue } from 'cotton-box-react'
import { DependencyList, useEffect } from 'react'
import { useIsApplePlatform } from '../../platform-checking'
import { InputFocusTracker } from '../input-focus'
import { LayeredFocusManager } from '../layered-focus'

const EVENT_KEYDOWN = 'keydown'
const EVENT_KEYUP = 'keyup'

/**
 * @public
 */
export class KeyEventHookUtils {

  constructor(
    readonly inputFocusTracker: InputFocusTracker,
    readonly layeredFocusManager: LayeredFocusManager,
    readonly keyChordManager: KeyChordManager,
  ) { }

  readonly useKeyChordActivationListener = (
    callback: (e: KeyboardEvent) => void,
    dependencies: DependencyList,
    enabled = true,
    ignoreLayerFocus = false,
  ): void => {
    const { useCheckInputFocus } = this.inputFocusTracker
    const { useLayeredFocusState } = this.layeredFocusManager
    const isAnyInputFocused = useCheckInputFocus()
    const isAppleOS = useIsApplePlatform()
    const [isFocused] = useLayeredFocusState()
    useEffect(() => {
      if (!enabled || isAnyInputFocused) { return } // Early exit
      if (!isFocused && !ignoreLayerFocus) { return } // Early exit
      let chordTimestamp: number
      let releaseKeyChord: ReturnType<typeof this.keyChordManager.occupyKeyChord> = null
      const onKeyDown = (e: KeyboardEvent) => {
        const now = performance.now()
        const modifierIsKeyActive = isAppleOS ? e.metaKey : e.ctrlKey
        if (modifierIsKeyActive && e.key === this.keyChordManager.activationKey) {
          chordTimestamp = now
          e.preventDefault()
          releaseKeyChord = this.keyChordManager.occupyKeyChord()
          setTimeout(releaseKeyChord, this.keyChordManager.timeout)
        } else if (now - chordTimestamp < this.keyChordManager.timeout) {
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
    }, [enabled, isAnyInputFocused, isFocused, ignoreLayerFocus, ...dependencies])
  }

  readonly useKeyDownListener = (
    onKeyDown: (e: KeyboardEvent) => void,
    dependencies: DependencyList,
    enabled = true,
    ignoreLayerFocus = false,
  ): void => {
    const { useCheckInputFocus } = this.inputFocusTracker
    const { useLayeredFocusState } = this.layeredFocusManager
    const isAnyInputFocused = useCheckInputFocus()
    const isOccupiedByKeyChord = useSimpleStateValue(this.keyChordManager.isOccupied)
    const [isFocused] = useLayeredFocusState()
    useEffect(() => {
      if (!enabled || isAnyInputFocused || isOccupiedByKeyChord) { return } // Early exit
      if (!isFocused && !ignoreLayerFocus) { return } // Early exit
      window.addEventListener(EVENT_KEYDOWN, onKeyDown)
      return () => { window.removeEventListener(EVENT_KEYDOWN, onKeyDown) }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, isAnyInputFocused, isOccupiedByKeyChord, isFocused, ignoreLayerFocus, ...dependencies])
  }

  readonly useKeyUpListener = (
    onKeyUp: (e: KeyboardEvent) => void,
    dependencies: DependencyList,
    enabled = true,
    ignoreLayerFocus = false,
  ): void => {
    const { useCheckInputFocus } = this.inputFocusTracker
    const { useLayeredFocusState } = this.layeredFocusManager
    const isAnyInputFocused = useCheckInputFocus()
    const isOccupiedByKeyChord = useSimpleStateValue(this.keyChordManager.isOccupied)
    const [isFocused] = useLayeredFocusState()
    useEffect(() => {
      if (!enabled || isAnyInputFocused || isOccupiedByKeyChord) { return } // Early exit
      if (!isFocused && !ignoreLayerFocus) { return } // Early exit
      window.addEventListener(EVENT_KEYUP, onKeyUp)
      return () => { window.removeEventListener(EVENT_KEYUP, onKeyUp) }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, isAnyInputFocused, isOccupiedByKeyChord, isFocused, ignoreLayerFocus, ...dependencies])
  }

}
