import { stringifyEqual } from '.'

test('Empty object', () => {
  const isEqual = stringifyEqual({}, {})
  expect(isEqual).toBe(true)
})

test('Different property size', () => {
  const prevState = { a: 'foo', b: 42 }
  const nextState = { a: 'foo', b: 42, c: [] }
  const isEqual = stringifyEqual(prevState, nextState)
  expect(isEqual).toBe(false)
})

test('Same property size, different property names', () => {
  const prevState = { a: 'foo', b: 42 }
  const nextState = { a: 'foo', c: 42 }
  const isEqual = stringifyEqual(prevState, nextState)
  expect(isEqual).toBe(false)
})

test('Same property size and names, different values', () => {
  const prevState = { a: 'foo', b: 42, c: [] }
  const nextState = { a: 'foo', b: 42, c: [] }
  const isEqual = stringifyEqual(prevState, nextState)
  expect(isEqual).toBe(true)
})

test('Same property size and names, same values', () => {
  const ARR = [] as const
  const prevState = { a: 'foo', b: 42, c: ARR }
  const nextState = { a: 'foo', b: 42, c: ARR }
  const isEqual = stringifyEqual(prevState, nextState)
  expect(isEqual).toBe(true)
})

describe('Class objects', () => {

  test('Should be equal', () => {
    const isEqual = stringifyEqual(
      new Date('2020/11/26'),
      new Date('2020/11/26')
    )
    expect(isEqual).toBe(true)
  })

  test('Should not be equal', () => {
    const isEqual = stringifyEqual(
      new Date('2020/11/26'),
      new Date('2020/11/27')
    )
    expect(isEqual).toBe(false)
  })

})
