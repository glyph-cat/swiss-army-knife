import { CleanupManager } from '@glyph-cat/cleanup-manager'
import { HookTester } from '@glyph-cat/react-test-utils'
import { useSandboxedState } from '.'

const cleanupManager = new CleanupManager()
afterEach(() => { cleanupManager.run() })

test(useSandboxedState.name, () => {

  // Goals:
  // - Ensure mutability of state (object reference is preserved)
  // - Ensure component re-render even when new state points to old state by object reference

  const INITIAL_STATE = []
  const DIFFERENT_REFERENCE_SAME_VALUE = []
  const DIFFERENT_REFERENCE_DIFFERENT_VALUE = [2]

  const tester = new HookTester({
    useHook: () => {
      return useSandboxedState<Array<number>>(INITIAL_STATE)
    },
    actions: {
      setStateSameReferenceSameValue(hookData) {
        const [, setState] = hookData
        setState(INITIAL_STATE)
      },
      setStateSameReferenceDifferentValue(hookData) {
        const [, setState] = hookData
        setState((prevState) => {
          prevState.push(1)
          return prevState
        })
      },
      setStateDifferentReferenceSameValue(hookData) {
        const [, setState] = hookData
        setState(DIFFERENT_REFERENCE_SAME_VALUE)
      },
      setStateDifferentReferenceDifferentValue(hookData) {
        const [, setState] = hookData
        setState(DIFFERENT_REFERENCE_DIFFERENT_VALUE)
      },
    },
    get: {
      value(hookData) {
        return hookData[0][0]
      },
    },
  }, cleanupManager)

  expect(Object.is(tester.get('value'), INITIAL_STATE)).toBe(true)

  expect(tester.action('setStateSameReferenceSameValue')).toBe(1)
  expect(Object.is(tester.get('value'), INITIAL_STATE)).toBe(true)
  expect(tester.get('value')).toStrictEqual([])

  expect(tester.action('setStateDifferentReferenceSameValue')).toBe(1)
  expect(Object.is(tester.get('value'), DIFFERENT_REFERENCE_SAME_VALUE)).toBe(true)
  expect(tester.get('value')).toStrictEqual([])

  expect(tester.action('setStateDifferentReferenceDifferentValue')).toBe(1)
  expect(Object.is(tester.get('value'), DIFFERENT_REFERENCE_DIFFERENT_VALUE)).toBe(true)
  expect(tester.get('value')).toStrictEqual([2])

  expect(tester.action('setStateSameReferenceDifferentValue')).toBe(1)
  expect(Object.is(tester.get('value'), DIFFERENT_REFERENCE_DIFFERENT_VALUE)).toBe(true)
  expect(tester.get('value')).toStrictEqual([2, 1])

})
