import { removeDuplicates } from '.'

describe('Primitive data type', () => {

  test('Has duplicates', () => {
    const original = [1, 2, 2, 2, 3, 2, 2, 3, 4, 4, 1]
    const output = removeDuplicates(original)
    expect(output).toStrictEqual([1, 2, 3, 4])
    expect(Object.is(original, output)).toBeFalse()
  })

  test('No duplicates', () => {
    const original = [1, 2, 3, 4]
    const output = removeDuplicates(original)
    expect(output).toStrictEqual([1, 2, 3, 4])
    expect(Object.is(original, output)).toBeFalse()
  })

})

describe('Complex data types', () => {

  describe('By key', () => {

    test('Has duplicates', () => {
      const original = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 2 }, { id: 4 }]
      const output = removeDuplicates(original, 'id')
      expect(output).toStrictEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
      expect(Object.is(original, output)).toBeFalse()
    })

    test('No duplicates', () => {
      const original = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
      const output = removeDuplicates(original, 'id')
      expect(output).toStrictEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
      expect(Object.is(original, output)).toBeFalse()
    })

  })

  describe('By predicate', () => {

    test('Parameters should be passed accordingly', () => {
      const original = [{ id: 1 }, { id: 2 }]
      const predicate = jest.fn((item) => item.id)
      removeDuplicates(original, predicate)
      expect(predicate).toHaveBeenCalledTimes(2)
      expect(predicate).toHaveBeenNthCalledWith(1, original[0], 0, original)
      expect(predicate).toHaveBeenNthCalledWith(2, original[1], 1, original)
    })

    test('Has duplicates', () => {
      const original = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 2 }, { id: 4 }]
      const output = removeDuplicates(original, (item) => item.id)
      expect(output).toStrictEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
      expect(Object.is(original, output)).toBeFalse()
    })

    test('No duplicates', () => {
      const original = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
      const output = removeDuplicates(original, (item) => item.id)
      expect(output).toStrictEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
      expect(Object.is(original, output)).toBeFalse()
    })

  })

})
