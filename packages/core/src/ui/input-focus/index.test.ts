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
  document.body.innerHTML = ''
})

afterEach(() => {
  // Allow tests in other files to start with a clean state.
  (AnyInputFocusState as SimpleStateManager<boolean>).reset()
  document.body.innerHTML = ''
})

describe('Document has focus within', () => {

  test('Target element is <input>', () => {
    const element = document.createElement('input')
    document.body.append(element)
    element.focus()
    expect(AnyInputFocusState.get()).toBeTrue()
    element.blur()
    expect(AnyInputFocusState.get()).toBeFalse()
  })

  test('Target element is <textarea>', () => {
    const element = document.createElement('textarea')
    document.body.append(element)
    element.focus()
    expect(AnyInputFocusState.get()).toBeTrue()
    element.blur()
    expect(AnyInputFocusState.get()).toBeFalse()
  })

  test('Target element is <select>', () => {
    const element = document.createElement('select')
    document.body.append(element)
    element.focus()
    expect(AnyInputFocusState.get()).toBeTrue()
    element.blur()
    expect(AnyInputFocusState.get()).toBeFalse()
  })

  test('Target element is other type', () => {
    const element = document.createElement('button')
    document.body.append(element)
    element.focus()
    expect(AnyInputFocusState.get()).toBeFalse()
    element.blur()
    expect(AnyInputFocusState.get()).toBeFalse()
  })

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
