import { getFirstKey, getFirstValue, getNthKey, getNthValue } from '.'

describe(getNthKey.name, () => {

  describe('Not empty object', () => {

    test('In range', () => {
      expect(getNthKey({ a: 1, b: 2, c: 3 }, 2)).toBe('b')
    })

    test('Out of range', () => {
      expect(getNthKey({ a: 1, b: 2, c: 3 }, 5)).toBe(undefined)
    })

  })

  test('Empty object', () => {
    expect(getNthKey({}, 5)).toBe(undefined)
  })

  test('Undefined object', () => {
    expect(getNthKey(undefined, 5)).toBe(undefined)
  })

  test('Returned type should be string', () => {
    expect(getNthKey({ 1: 'a' }, 1)).toBe('1')
  })

})

describe(getNthValue.name, () => {

  describe('Not empty object', () => {

    test('In range', () => {
      expect(getNthValue({ a: 1, b: 2, c: 3 }, 2)).toBe(2)
    })

    test('Out of range', () => {
      expect(getNthValue({ a: 1, b: 2, c: 3 }, 5)).toBe(undefined)
    })

  })

  test('Empty object', () => {
    expect(getNthValue({}, 5)).toBe(undefined)
  })

  test('Undefined object', () => {
    expect(getNthValue(undefined, 5)).toBe(undefined)
  })

})

describe(getFirstKey.name, () => {

  test('Not empty object', () => {
    expect(getFirstKey({ a: 1, b: 2, c: 3 })).toBe('a')
  })

  test('Empty object', () => {
    expect(getFirstKey({})).toBe(undefined)
  })

  test('Undefined object', () => {
    expect(getFirstKey(undefined)).toBe(undefined)
  })

})

describe(getFirstValue.name, () => {

  test('Not empty object', () => {
    expect(getFirstValue({ a: 1, b: 2, c: 3 })).toBe(1)
  })

  test('Empty object', () => {
    expect(getFirstValue({})).toBe(undefined)
  })

  test('Undefined object', () => {
    expect(getFirstValue(undefined)).toBe(undefined)
  })

})
