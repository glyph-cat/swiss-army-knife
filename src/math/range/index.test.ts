import { isInRange, isOutOfRange } from '.'

describe(isInRange.name, () => {

  test('Number types', () => {
    expect(isInRange(10, 0, 100)).toBe(true)
    expect(isInRange(-10, 0, 100)).toBe(false)
  })

  test('String types', () => {
    expect(isInRange('c', 'b', 'd')).toBe(true)
    expect(isInRange('a', 'b', 'd')).toBe(false)
  })

  test('Date types', () => {
    expect(isInRange(
      new Date('2024/06/01'),
      new Date('2024/02/01'),
      new Date('2024/12/01'),
    )).toBe(true)
    expect(isInRange(
      new Date('2024/01/01'),
      new Date('2024/02/01'),
      new Date('2024/12/01'),
    )).toBe(false)
  })

})

describe(isOutOfRange.name, () => {

  test('Number types', () => {
    expect(isOutOfRange(10, 0, 100)).toBe(false)
    expect(isOutOfRange(-10, 0, 100)).toBe(true)
  })

  test('String types', () => {
    expect(isOutOfRange('c', 'b', 'd')).toBe(false)
    expect(isOutOfRange('a', 'b', 'd')).toBe(true)
  })

  test('Date types', () => {
    expect(isOutOfRange(
      new Date('2024/06/01'),
      new Date('2024/02/01'),
      new Date('2024/12/01'),
    )).toBe(false)
    expect(isOutOfRange(
      new Date('2024/01/01'),
      new Date('2024/02/01'),
      new Date('2024/12/01'),
    )).toBe(true)
  })

})
