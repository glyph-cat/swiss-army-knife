import { isJSONequal } from '.'

test('Empty object', () => {
  const isEqual = isJSONequal({}, {})
  expect(isEqual).toBeTrue()
})

test('Different property size', () => {
  const prevState = { a: 'foo', b: 42 }
  const nextState = { a: 'foo', b: 42, c: [] }
  const isEqual = isJSONequal(prevState, nextState)
  expect(isEqual).toBeFalse()
})

test('Same property size, different property names', () => {
  const prevState = { a: 'foo', b: 42 }
  const nextState = { a: 'foo', c: 42 }
  const isEqual = isJSONequal(prevState, nextState)
  expect(isEqual).toBeFalse()
})

test('Same property size and names, different values', () => {
  const prevState = { a: 'foo', b: 42, c: [] }
  const nextState = { a: 'foo', b: 42, c: [] }
  const isEqual = isJSONequal(prevState, nextState)
  expect(isEqual).toBeTrue()
})

test('Same property size and names, same values', () => {
  const ARR = [] as const
  const prevState = { a: 'foo', b: 42, c: ARR }
  const nextState = { a: 'foo', b: 42, c: ARR }
  const isEqual = isJSONequal(prevState, nextState)
  expect(isEqual).toBeTrue()
})

describe('Class objects', () => {

  test('Should be equal', () => {
    const isEqual = isJSONequal(
      new Date('2020/11/26'),
      new Date('2020/11/26')
    )
    expect(isEqual).toBeTrue()
  })

  test('Should not be equal', () => {
    const isEqual = isJSONequal(
      new Date('2020/11/26'),
      new Date('2020/11/27')
    )
    expect(isEqual).toBeFalse()
  })

})
