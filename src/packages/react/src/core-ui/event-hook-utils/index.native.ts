import { KeyChordManager, UnsupportedPlatformError } from '@glyph-cat/swiss-army-knife'
import { InputFocusTracker } from '../input-focus'
import { LayeredFocusManager } from '../layered-focus'

/**
 * @public
 */
export class KeyEventHookUtils {

  constructor(
    readonly inputFocusTracker: InputFocusTracker,
    readonly layeredFocusManager: LayeredFocusManager,
    readonly keyChordManager: KeyChordManager,
  ) {
    throw new UnsupportedPlatformError()
  }

}
