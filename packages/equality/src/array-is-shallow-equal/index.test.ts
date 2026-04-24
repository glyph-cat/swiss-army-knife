import { arrayIsShallowEqual } from '.'

test('Empty array', () => {
  const isEqual = arrayIsShallowEqual([], [])
  expect(isEqual).toBeTrue()
})

describe('Different types', () => {

  test('undefined, []', () => {
    const isEqual = arrayIsShallowEqual(undefined, [])
    expect(isEqual).toBeFalse()
  })

  test('number, []', () => {
    const isEqual = arrayIsShallowEqual(42, [])
    expect(isEqual).toBeFalse()
  })

})

test('Different length', () => {
  const prevState = ['foo', 42]
  const nextState = ['foo', 'bar', 42]
  const isEqual = arrayIsShallowEqual(prevState, nextState)
  expect(isEqual).toBeFalse()
})

test('Same length, different items', () => {
  const prevState = ['foo', {}, 42]
  const nextState = ['foo', {}, 42]
  const isEqual = arrayIsShallowEqual(prevState, nextState)
  expect(isEqual).toBeFalse()
})

test('Same length, same items', () => {
  const OBJ = {}
  const prevState = ['foo', OBJ, 42]
  const nextState = ['foo', OBJ, 42]
  const isEqual = arrayIsShallowEqual(prevState, nextState)
  expect(isEqual).toBeTrue()
})
