import { KeyChordManager } from '@glyph-cat/swiss-army-knife'
import { InputFocusTracker, LayeredFocusManager } from '@glyph-cat/swiss-army-knife-react'

export const GlobalLayeredFocusManager = new LayeredFocusManager()
export const GlobalInputFocusTracker = new InputFocusTracker()
export const GlobalKeyChordManager = new KeyChordManager()

export {
  ButtonBase as Button, FocusableView, FocusLayer, FocusRoot, Input, Select, TextArea, useCheckInputFocus, useKeyChordActivationListener,
  useKeyDownListener, useKeyUpListener, useLayeredFocusState, View
} from '@glyph-cat/swiss-army-knife-react'
