import { KeyChordManager } from '@glyph-cat/swiss-army-knife'
import {
  CoreUIComposer,
  DisabledContext,
  InputFocusTracker,
  IView,
  KeyEventHookUtils,
  LayeredFocusManager,
} from '@glyph-cat/swiss-army-knife-react'

export const GlobalDisabledContext = new DisabledContext()

export const GlobalInputFocusTracker = new InputFocusTracker()
export const { useCheckInputFocus } = GlobalInputFocusTracker

export const GlobalLayeredFocusManager = new LayeredFocusManager()

export const GlobalKeyChordManager = new KeyChordManager()

export const {
  useKeyChordActivationListener,
  useKeyDownListener,
  useKeyUpListener,
} = new KeyEventHookUtils(
  GlobalInputFocusTracker,
  GlobalLayeredFocusManager,
  GlobalKeyChordManager,
)

const DEFAULT_KEY = 'x'

export const GlobalCoreUIComposer = new CoreUIComposer(DEFAULT_KEY, {
  disabledContext: GlobalDisabledContext,
  inputFocusTracker: GlobalInputFocusTracker,
  layeredFocusManager: GlobalLayeredFocusManager,
})

export type View = IView
export const View = GlobalCoreUIComposer.createViewComponent(DEFAULT_KEY)[0]
