import { KeyChordManager } from '@glyph-cat/swiss-army-knife'
import {
  CoreUIComposer,
  DisabledContext,
  IButton,
  IFocusableView,
  IInput,
  InputFocusTracker,
  ISelect,
  ITextArea,
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
export const View = GlobalCoreUIComposer.createViewComponent(DEFAULT_KEY)

export type FocusableView = IFocusableView
export const FocusableView = GlobalCoreUIComposer.createFocusableViewComponent(DEFAULT_KEY)

export type Input = IInput
export const Input = GlobalCoreUIComposer.createInputComponent(DEFAULT_KEY)

export type TextArea = ITextArea
export const TextArea = GlobalCoreUIComposer.createTextAreaComponent(DEFAULT_KEY)

export type Button = IButton
export const Button = GlobalCoreUIComposer.createButtonComponent(DEFAULT_KEY)

export type Select = ISelect
export const Select = GlobalCoreUIComposer.createSelectComponent(DEFAULT_KEY)
