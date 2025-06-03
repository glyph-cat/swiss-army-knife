import { arrayShallowEqual } from '.'

test('Empty array', () => {
  const isEqual = arrayShallowEqual([], [])
  expect(isEqual).toBe(true)
})

describe('Different types', () => {

  test('undefined, []', () => {
    const isEqual = arrayShallowEqual(undefined, [])
    expect(isEqual).toBe(false)
  })

  test('number, []', () => {
    const isEqual = arrayShallowEqual(42, [])
    expect(isEqual).toBe(false)
  })

})

test('Different length', () => {
  const prevState = ['foo', 42]
  const nextState = ['foo', 'bar', 42]
  const isEqual = arrayShallowEqual(prevState, nextState)
  expect(isEqual).toBe(false)
})

test('Same length, different items', () => {
  const prevState = ['foo', {}, 42]
  const nextState = ['foo', {}, 42]
  const isEqual = arrayShallowEqual(prevState, nextState)
  expect(isEqual).toBe(false)
})

test('Same length, same items', () => {
  const OBJ = {}
  const prevState = ['foo', OBJ, 42]
  const nextState = ['foo', OBJ, 42]
  const isEqual = arrayShallowEqual(prevState, nextState)
  expect(isEqual).toBe(true)
})
