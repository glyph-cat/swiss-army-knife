import { shallowCompareArrayOrObject } from '.'
import * as $EqArr from '../shallow-compare-array'
import * as $EqObj from '../shallow-compare-object'

beforeEach(() => {
  // NOTE: Unable to mock when we `import { foo } from './foo'`
  // @ts-expect-error: This is acceptable for testing
  $EqArr.shallowCompareArray = jest.fn($EqArr.shallowCompareArray)
  // @ts-expect-error: This is acceptable for testing
  $EqObj.shallowCompareObject = jest.fn($EqObj.shallowCompareObject)
})

test('[], []', () => {
  const isEqual = shallowCompareArrayOrObject([], [])
  expect(isEqual).toBe(true)
  expect($EqArr.shallowCompareArray).toHaveBeenCalledTimes(1)
})

test('[], {}', () => {
  const isEqual = shallowCompareArrayOrObject([], {})
  expect(isEqual).toBe(false)
  expect($EqArr.shallowCompareArray).not.toHaveBeenCalledTimes(1)
  expect($EqObj.shallowCompareObject).not.toHaveBeenCalledTimes(1)
})

test('{}, []', () => {
  const isEqual = shallowCompareArrayOrObject({}, [])
  expect(isEqual).toBe(false)
  expect($EqArr.shallowCompareArray).not.toHaveBeenCalled()
  expect($EqObj.shallowCompareObject).not.toHaveBeenCalled()
})

test('{}, {}', () => {
  const isEqual = shallowCompareArrayOrObject({}, {})
  expect(isEqual).toBe(true)
  expect($EqObj.shallowCompareObject).toHaveBeenCalledTimes(1)
})

test('{}, primitive type', () => {
  const isEqual = shallowCompareArrayOrObject({}, 'hello')
  expect(isEqual).toBe(false)
  expect($EqObj.shallowCompareObject).toHaveBeenCalledTimes(1)
})

test('[], primitive type', () => {
  const isEqual = shallowCompareArrayOrObject([], 'hello')
  expect(isEqual).toBe(false)
  expect($EqArr.shallowCompareArray).not.toHaveBeenCalledTimes(1)
  expect($EqObj.shallowCompareObject).not.toHaveBeenCalledTimes(1)
})

describe('primitive type, primitive type', () => {

  test('Should be equal', () => {
    const isEqual = shallowCompareArrayOrObject('hello', 'hello')
    expect(isEqual).toBe(true)
    expect($EqObj.shallowCompareObject).toHaveBeenCalledTimes(1)
  })

  test('Should not be equal', () => {
    const isEqual = shallowCompareArrayOrObject('hello', 'world')
    expect(isEqual).toBe(false)
    expect($EqObj.shallowCompareObject).toHaveBeenCalledTimes(1)
  })

})
