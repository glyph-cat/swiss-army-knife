import { shuffle, shuffleMutable } from '.'

// NOTE: It is possible for shuffled array to be the same as the original.
// So here, we are only testing when `strict = true`.

const totalTestIterations = 50

describe(shuffle.name, (): void => {

  test('Main use case', () => {
    for (let i = 0; i < totalTestIterations; i++) {

      const originalArray = [1, 2, 3, 4, 5]
      const originalSnapshot = String(originalArray)

      const output = shuffle(originalArray, true)
      const outputSnapshot = String(output)

      // Original array should not be modified.
      expect(String(originalArray)).toBe(originalSnapshot)

      // Function should return a new array.
      expect(Object.is(originalArray, output)).toBe(false)

      // Shuffled order should not be the same as original.
      const snapshotsAreEquivalent = outputSnapshot === originalSnapshot
      if (snapshotsAreEquivalent) {
        console.error(`[Iteration ${i} of ${totalTestIterations}] Expected output snapshot "${outputSnapshot}" to NOT be equal to "${originalSnapshot}" but they were the same.`)
      }
      expect(snapshotsAreEquivalent).toBe(false)

    }
  })

  /**
   * Infinite loop should not occur when strict = true but array has 0 or 1 item.
   */
  describe('Special cases', () => {

    test('0 items', () => {
      const originalArray: Array<unknown> = []
      const output = shuffle(originalArray, true)
      expect(output).toStrictEqual([])
    })

    test('1 item', () => {
      const originalArray = [42]
      const output = shuffle(originalArray, true)
      expect(output).toStrictEqual([42])
    })

  })

})

describe(shuffleMutable.name, (): void => {

  test('Main use case', () => {
    for (let i = 0; i < totalTestIterations; i++) {

      const originalArray = [1, 2, 3, 4, 5]
      const originalSnapshot = String(originalArray)

      const output = shuffleMutable(originalArray, true)
      const outputSnapshot = String(output)

      // Function should return a reference to the original array.
      expect(Object.is(originalArray, output)).toBe(true)

      // Shuffled order should not be the same as original.
      const snapshotsAreEquivalent = outputSnapshot === originalSnapshot
      if (snapshotsAreEquivalent) {
        console.error(`[Iteration ${i} of ${totalTestIterations}] Expected output snapshot "${outputSnapshot}" to NOT be equal to "${originalSnapshot}" but they were the same.`)
      }
      expect(snapshotsAreEquivalent).toBe(false)

    }
  })

  /**
   * Infinite loop should not occur when strict = true but array has 0 or 1 item.
   */
  describe('Special cases', () => {

    test('0 items', () => {
      const originalArray: Array<unknown> = []
      const output = shuffleMutable(originalArray, true)
      expect(output).toStrictEqual([])
    })

    test('1 item', () => {
      const originalArray = [42]
      const output = shuffleMutable(originalArray, true)
      expect(output).toStrictEqual([42])
    })

  })

})
