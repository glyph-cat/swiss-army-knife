import { clampedPush, clampedUnshift } from '.'

describe(clampedPush.name, (): void => {

  test('Resulting array\'s length does not exceed limit', (): void => {
    const array = [1, 2, 3, 4]
    const output = clampedPush(7, [5, 6], array)
    expect(output).toStrictEqual([1, 2, 3, 4, 5, 6])
    expect(Object.is(array, output)).toBe(false) // Immutability checking
  })

  test('Resulting array\'s length exceeds limit', (): void => {
    const array = [1, 2, 3, 4]
    const output = clampedPush(7, [5, 6, 7, 8], array)
    expect(output).toStrictEqual([2, 3, 4, 5, 6, 7, 8])
    expect(Object.is(array, output)).toBe(false) // Immutability checking
  })

})

describe(clampedUnshift.name, (): void => {

  describe('options.harshJoin = false', (): void => {

    test('Resulting array\'s length does not exceed limit', (): void => {
      const array = [1, 2, 3, 4]
      const output = clampedUnshift(7, [5, 6], array)
      expect(output).toStrictEqual([6, 5, 1, 2, 3, 4])
      expect(Object.is(array, output)).toBe(false) // Immutability checking
    })

    test('Resulting array\'s length exceeds limit', (): void => {
      const array = [1, 2, 3, 4]
      const output = clampedUnshift(7, [5, 6, 7, 8], array)
      expect(output).toStrictEqual([8, 7, 6, 5, 1, 2, 3])
      expect(Object.is(array, output)).toBe(false) // Immutability checking
    })

  })

  describe('options.harshJoin = true', (): void => {

    test('Resulting array\'s length does not exceed limit', (): void => {
      const array = [1, 2, 3, 4]
      const output = clampedUnshift(7, [5, 6], array, { harshJoin: true })
      expect(output).toStrictEqual([5, 6, 1, 2, 3, 4])
      expect(Object.is(array, output)).toBe(false) // Immutability checking
    })

    test('Resulting array\'s length exceeds limit', (): void => {
      const array = [1, 2, 3, 4]
      const output = clampedUnshift(7, [5, 6, 7, 8], array, { harshJoin: true })
      expect(output).toStrictEqual([5, 6, 7, 8, 1, 2, 3])
      expect(Object.is(array, output)).toBe(false) // Immutability checking
    })

  })

})
