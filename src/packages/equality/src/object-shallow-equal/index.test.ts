import { objectShallowEqual } from '.'

test('Empty object', () => {
  const isEqual = objectShallowEqual({}, {})
  expect(isEqual).toBe(true)
})

describe('Different types', () => {

  test('undefined, []', () => {
    const isEqual = objectShallowEqual(undefined, {})
    expect(isEqual).toBe(false)
  })

  test('number, []', () => {
    const isEqual = objectShallowEqual(42, {})
    expect(isEqual).toBe(false)
  })

})

test('Different property size', () => {
  const prevState = { a: 'foo', b: 42 }
  const nextState = { a: 'foo', b: 42, c: [] }
  const isEqual = objectShallowEqual(prevState, nextState)
  expect(isEqual).toBe(false)
})

test('Same property size, different property names', () => {
  const prevState = { a: 'foo', b: 42 }
  const nextState = { a: 'foo', c: 42 }
  const isEqual = objectShallowEqual(prevState, nextState)
  expect(isEqual).toBe(false)
})

test('Same property size and names, different values', () => {
  const prevState = { a: 'foo', b: 42, c: [] }
  const nextState = { a: 'foo', b: 42, c: [] }
  const isEqual = objectShallowEqual(prevState, nextState)
  expect(isEqual).toBe(false)
})

test('Same property size and names, same values', () => {
  const ARR = [] as const
  const prevState = { a: 'foo', b: 42, c: ARR }
  const nextState = { a: 'foo', b: 42, c: ARR }
  const isEqual = objectShallowEqual(prevState, nextState)
  expect(isEqual).toBe(true)
})

test('All same, but arrangement different', () => {
  const ARR = [] as const
  const prevState = { a: 'foo', b: 42, c: ARR }
  const nextState = { a: 'foo', c: ARR, b: 42 }
  const isEqual = objectShallowEqual(prevState, nextState)
  expect(isEqual).toBe(false)
})
