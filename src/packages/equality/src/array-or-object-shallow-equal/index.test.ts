import { arrayOrObjectShallowEqual } from '.'
import * as $EqArr from '../array-shallow-equal'
import * as $EqObj from '../object-shallow-equal'

beforeEach(() => {
  // NOTE: Unable to mock when we `import { foo } from './foo'`
  // @ts-expect-error: This is acceptable for testing
  $EqArr.arrayShallowEqual = jest.fn($EqArr.arrayShallowEqual)
  // @ts-expect-error: This is acceptable for testing
  $EqObj.objectShallowEqual = jest.fn($EqObj.objectShallowEqual)
})

test('[], []', () => {
  const isEqual = arrayOrObjectShallowEqual([], [])
  expect(isEqual).toBe(true)
  expect($EqArr.arrayShallowEqual).toHaveBeenCalledTimes(1)
})

test('[], {}', () => {
  const isEqual = arrayOrObjectShallowEqual([], {})
  expect(isEqual).toBe(false)
  expect($EqArr.arrayShallowEqual).not.toHaveBeenCalledTimes(1)
  expect($EqObj.objectShallowEqual).not.toHaveBeenCalledTimes(1)
})

test('{}, []', () => {
  const isEqual = arrayOrObjectShallowEqual({}, [])
  expect(isEqual).toBe(false)
  expect($EqArr.arrayShallowEqual).not.toHaveBeenCalled()
  expect($EqObj.objectShallowEqual).not.toHaveBeenCalled()
})

test('{}, {}', () => {
  const isEqual = arrayOrObjectShallowEqual({}, {})
  expect(isEqual).toBe(true)
  expect($EqObj.objectShallowEqual).toHaveBeenCalledTimes(1)
})

test('{}, primitive type', () => {
  const isEqual = arrayOrObjectShallowEqual({}, 'hello')
  expect(isEqual).toBe(false)
  expect($EqObj.objectShallowEqual).toHaveBeenCalledTimes(1)
})

test('[], primitive type', () => {
  const isEqual = arrayOrObjectShallowEqual([], 'hello')
  expect(isEqual).toBe(false)
  expect($EqArr.arrayShallowEqual).not.toHaveBeenCalledTimes(1)
  expect($EqObj.objectShallowEqual).not.toHaveBeenCalledTimes(1)
})

describe('primitive type, primitive type', () => {

  test('Should be equal', () => {
    const isEqual = arrayOrObjectShallowEqual('hello', 'hello')
    expect(isEqual).toBe(true)
    expect($EqObj.objectShallowEqual).toHaveBeenCalledTimes(1)
  })

  test('Should not be equal', () => {
    const isEqual = arrayOrObjectShallowEqual('hello', 'world')
    expect(isEqual).toBe(false)
    expect($EqObj.objectShallowEqual).toHaveBeenCalledTimes(1)
  })

})
