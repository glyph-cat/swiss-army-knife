import { objectIsShallowEqual } from '.'

test('Empty object', () => {
  const isEqual = objectIsShallowEqual({}, {})
  expect(isEqual).toBeTrue()
})

describe('Different types', () => {

  test('undefined, []', () => {
    const isEqual = objectIsShallowEqual(undefined, {})
    expect(isEqual).toBeFalse()
  })

  test('number, []', () => {
    const isEqual = objectIsShallowEqual(42, {})
    expect(isEqual).toBeFalse()
  })

})

test('Different property size', () => {
  const prevState = { a: 'foo', b: 42 }
  const nextState = { a: 'foo', b: 42, c: [] }
  const isEqual = objectIsShallowEqual(prevState, nextState)
  expect(isEqual).toBeFalse()
})

test('Same property size, different property names', () => {
  const prevState = { a: 'foo', b: 42 }
  const nextState = { a: 'foo', c: 42 }
  const isEqual = objectIsShallowEqual(prevState, nextState)
  expect(isEqual).toBeFalse()
})

test('Same property size and names, different values', () => {
  const prevState = { a: 'foo', b: 42, c: [] }
  const nextState = { a: 'foo', b: 42, c: [] }
  const isEqual = objectIsShallowEqual(prevState, nextState)
  expect(isEqual).toBeFalse()
})

test('Same property size and names, same values', () => {
  const ARR = [] as const
  const prevState = { a: 'foo', b: 42, c: ARR }
  const nextState = { a: 'foo', b: 42, c: ARR }
  const isEqual = objectIsShallowEqual(prevState, nextState)
  expect(isEqual).toBeTrue()
})

test('All same, but arrangement different', () => {
  const ARR = [] as const
  const prevState = { a: 'foo', b: 42, c: ARR }
  const nextState = { a: 'foo', c: ARR, b: 42 }
  const isEqual = objectIsShallowEqual(prevState, nextState)
  expect(isEqual).toBeFalse()
})
