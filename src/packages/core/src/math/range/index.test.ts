import { isInRange, isOutOfRange } from '.'

describe(isInRange.name, () => {

  test('Number types', () => {
    expect(isInRange(10, 0, 100)).toBeTrue()
    expect(isInRange(-10, 0, 100)).toBeFalse()
  })

  test('String types', () => {
    expect(isInRange('c', 'b', 'd')).toBeTrue()
    expect(isInRange('a', 'b', 'd')).toBeFalse()
  })

  test('Date types', () => {
    expect(isInRange(
      new Date('2024/06/01'),
      new Date('2024/02/01'),
      new Date('2024/12/01'),
    )).toBeTrue()
    expect(isInRange(
      new Date('2024/01/01'),
      new Date('2024/02/01'),
      new Date('2024/12/01'),
    )).toBeFalse()
  })

})

describe(isOutOfRange.name, () => {

  test('Number types', () => {
    expect(isOutOfRange(10, 0, 100)).toBeFalse()
    expect(isOutOfRange(-10, 0, 100)).toBeTrue()
  })

  test('String types', () => {
    expect(isOutOfRange('c', 'b', 'd')).toBeFalse()
    expect(isOutOfRange('a', 'b', 'd')).toBeTrue()
  })

  test('Date types', () => {
    expect(isOutOfRange(
      new Date('2024/06/01'),
      new Date('2024/02/01'),
      new Date('2024/12/01'),
    )).toBeFalse()
    expect(isOutOfRange(
      new Date('2024/01/01'),
      new Date('2024/02/01'),
      new Date('2024/12/01'),
    )).toBeTrue()
  })

})
