import { CleanupManager } from '@glyph-cat/cleanup-manager'
import { objectIsShallowEqual } from '@glyph-cat/equality'
import { HookTester } from '@glyph-cat/react-test-utils'
import { useState } from 'react'
import { useMemoAlt } from '.'

let cleanupManager: CleanupManager
beforeEach(() => { cleanupManager = new CleanupManager() })
afterEach(() => { cleanupManager.run() })

test('Dependencies are same', () => {

  const spyFn = jest.fn()

  const tester = new HookTester({
    useHook: () => {
      const [object, setObject] = useState({ a: 1, b: 2, c: 3 })
      const memoizedObject = useMemoAlt(() => {
        spyFn()
        return object
      }, [object], (a, b) => {
        return objectIsShallowEqual(a[0], b[0])
      })
      return { memoizedObject: memoizedObject, setObject }
    },
    actions: {
      setObject: (hookData) => { hookData.setObject({ a: 1, b: 2, c: 3 }) },
    },
    values: {
      value: (hookData) => hookData.memoizedObject,
    },
  }, cleanupManager)

  const snapshot1 = tester.get('value')
  expect(snapshot1).toStrictEqual({ a: 1, b: 2, c: 3 })
  expect(spyFn).toHaveBeenCalledTimes(1)

  tester.action('setObject')
  const snapshot2 = tester.get('value')
  expect(snapshot2).toStrictEqual({ a: 1, b: 2, c: 3 })
  expect(Object.is(snapshot1, snapshot2)).toBe(true)
  expect(spyFn).toHaveBeenCalledTimes(1)

})

test('Dependencies are different', () => {

  const spyFn = jest.fn()

  const tester = new HookTester({
    useHook: () => {
      const [object, setObject] = useState({ a: 1, b: 2, c: 3 })
      const memoizedObject = useMemoAlt(() => {
        spyFn()
        return object
      }, [object], (a, b) => {
        return objectIsShallowEqual(a[0], b[0])
      })
      return { memoizedObject: memoizedObject, setObject }
    },
    actions: {
      setObject: (hookData) => { hookData.setObject({ a: 1, b: 2, c: 7 }) },
    },
    values: {
      value: (hookData) => hookData.memoizedObject,
    },
  }, cleanupManager)

  const snapshot1 = tester.get('value')
  expect(snapshot1).toStrictEqual({ a: 1, b: 2, c: 3 })
  expect(spyFn).toHaveBeenCalledTimes(1)

  tester.action('setObject')
  const snapshot2 = tester.get('value')
  expect(snapshot2).toStrictEqual({ a: 1, b: 2, c: 7 })
  expect(Object.is(snapshot1, snapshot2)).toBe(false)
  expect(spyFn).toHaveBeenCalledTimes(2)

})
