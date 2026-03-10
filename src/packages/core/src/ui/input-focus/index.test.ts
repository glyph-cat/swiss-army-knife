/** @jest-environment jsdom */
import { SimpleStateManager } from 'cotton-box'
import {
  AnyInputFocusState,
  manuallyRegisterInputBlur,
  manuallyRegisterInputFocus,
} from '.'

beforeEach(() => {
  // Make sure test starts with a clean state.
  (AnyInputFocusState as SimpleStateManager<boolean>).reset()
})

afterEach(() => {
  // Allow tests in other files to start with a clean state.
  (AnyInputFocusState as SimpleStateManager<boolean>).reset()
})

test('Document has focus within', () => {
  window.dispatchEvent(new FocusEvent('focusin'))
  expect(AnyInputFocusState.get()).toBeTrue()
  window.dispatchEvent(new FocusEvent('focusout'))
  expect(AnyInputFocusState.get()).toBeFalse()
})

describe('Component ID is string', () => {

  test('Register and unregister with componentId', () => {
    const componentId = 'test-id'
    manuallyRegisterInputFocus(componentId)
    expect(AnyInputFocusState.get()).toBeTrue()
    manuallyRegisterInputBlur(componentId)
    expect(AnyInputFocusState.get()).toBeFalse()
  })

  test('Register with componentId, unregister with callback', () => {
    const componentId = 'test-id'
    const registerInputBlur = manuallyRegisterInputFocus(componentId)
    expect(AnyInputFocusState.get()).toBeTrue()
    registerInputBlur()
    expect(AnyInputFocusState.get()).toBeFalse()
  })

  test('Register without componentId, unregister with callback', () => {
    const registerInputBlur = manuallyRegisterInputFocus()
    expect(AnyInputFocusState.get()).toBeTrue()
    registerInputBlur()
    expect(AnyInputFocusState.get()).toBeFalse()
  })

})

describe('Component ID is symbol', () => {

  test('Register and unregister with componentId', () => {
    const componentId = Symbol('test-id')
    manuallyRegisterInputFocus(componentId)
    expect(AnyInputFocusState.get()).toBeTrue()
    manuallyRegisterInputBlur(componentId)
    expect(AnyInputFocusState.get()).toBeFalse()
  })

  test('Register with componentId, unregister with callback', () => {
    const componentId = Symbol('test-id')
    const registerInputBlur = manuallyRegisterInputFocus(componentId)
    expect(AnyInputFocusState.get()).toBeTrue()
    registerInputBlur()
    expect(AnyInputFocusState.get()).toBeFalse()
  })

  test('Register without componentId, unregister with callback', () => {
    const registerInputBlur = manuallyRegisterInputFocus()
    expect(AnyInputFocusState.get()).toBeTrue()
    registerInputBlur()
    expect(AnyInputFocusState.get()).toBeFalse()
  })

})
