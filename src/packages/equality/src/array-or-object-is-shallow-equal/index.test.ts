import { arrayOrObjectIsShallowEqual } from '.'
import * as $EqArr from '../array-is-shallow-equal'
import * as $EqObj from '../object-is-shallow-equal'

beforeEach(() => {
  // NOTE: Unable to mock when we `import { foo } from './foo'`
  // @ts-expect-error: This is acceptable for testing
  $EqArr.arrayIsShallowEqual = jest.fn($EqArr.arrayIsShallowEqual)
  // @ts-expect-error: This is acceptable for testing
  $EqObj.objectIsShallowEqual = jest.fn($EqObj.objectIsShallowEqual)
})

test('[], []', () => {
  const isEqual = arrayOrObjectIsShallowEqual([], [])
  expect(isEqual).toBe(true)
  expect($EqArr.arrayIsShallowEqual).toHaveBeenCalledTimes(1)
})

test('[], {}', () => {
  const isEqual = arrayOrObjectIsShallowEqual([], {})
  expect(isEqual).toBe(false)
  expect($EqArr.arrayIsShallowEqual).not.toHaveBeenCalledTimes(1)
  expect($EqObj.objectIsShallowEqual).not.toHaveBeenCalledTimes(1)
})

test('{}, []', () => {
  const isEqual = arrayOrObjectIsShallowEqual({}, [])
  expect(isEqual).toBe(false)
  expect($EqArr.arrayIsShallowEqual).not.toHaveBeenCalled()
  expect($EqObj.objectIsShallowEqual).not.toHaveBeenCalled()
})

test('{}, {}', () => {
  const isEqual = arrayOrObjectIsShallowEqual({}, {})
  expect(isEqual).toBe(true)
  expect($EqObj.objectIsShallowEqual).toHaveBeenCalledTimes(1)
})

test('{}, primitive type', () => {
  const isEqual = arrayOrObjectIsShallowEqual({}, 'hello')
  expect(isEqual).toBe(false)
  expect($EqObj.objectIsShallowEqual).toHaveBeenCalledTimes(1)
})

test('[], primitive type', () => {
  const isEqual = arrayOrObjectIsShallowEqual([], 'hello')
  expect(isEqual).toBe(false)
  expect($EqArr.arrayIsShallowEqual).not.toHaveBeenCalledTimes(1)
  expect($EqObj.objectIsShallowEqual).not.toHaveBeenCalledTimes(1)
})

describe('primitive type, primitive type', () => {

  test('Should be equal', () => {
    const isEqual = arrayOrObjectIsShallowEqual('hello', 'hello')
    expect(isEqual).toBe(true)
    expect($EqObj.objectIsShallowEqual).toHaveBeenCalledTimes(1)
  })

  test('Should not be equal', () => {
    const isEqual = arrayOrObjectIsShallowEqual('hello', 'world')
    expect(isEqual).toBe(false)
    expect($EqObj.objectIsShallowEqual).toHaveBeenCalledTimes(1)
  })

})
