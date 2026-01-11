import { createSleepSorter } from '.'

const sleepSort = createSleepSorter()

describe(sleepSort.name, (): void => {

  describe('Array<number>', (): void => {

    test('Simple', (): void => {
      const unsortedArray = [3, 1, 4, 2]
      const sortedArray = sleepSort(unsortedArray)
      const expectedArray = [...unsortedArray.sort()]
      expect(sortedArray).toStrictEqual(expectedArray)
    })

    test('Stress', (): void => {
      const unsortedArray = [
        8, 5, 3, 9, 2, 7, 5, 9, 6, 8,
        7, 8, 0, 4, 5, 3, 9, 7, 4, 7,
        4, 0, 1, 8, 4, 6, 7, 3, 2, 4,
      ]
      const sortedArray = sleepSort(unsortedArray)
      const expectedArray = [...unsortedArray.sort()]
      expect(sortedArray).toStrictEqual(expectedArray)
    })

  })

  describe('Array<object>', (): void => {

    test('Simple', (): void => {
      const unsortedArray = ['C', 'A', 'D', 'B']
      const sortedArray = sleepSort(unsortedArray, (item) => {
        return String.prototype.charCodeAt.call(item, 0)
      })
      const expectedArray = [...unsortedArray.sort()]
      expect(sortedArray).toStrictEqual(expectedArray)
    })

    test('Stress', (): void => {
      const unsortedArray = [
        'b', 'S', 'W', 'X', 'F', 'k',
        'B', 'W', 'E', 'U', 'i', 's',
        'i', 'I', 'Z', 'U', 'f', 'N',
        'T', 'g', 'W', 'D', 'H', 'H',
        'T', 'k', 'y', 'g', 'd', 'n',
      ]
      const sortedArray = sleepSort(unsortedArray, (item) => {
        return String.prototype.charCodeAt.call(item, 0)
      })
      const expectedArray = [...unsortedArray.sort()]
      expect(sortedArray).toStrictEqual(expectedArray)
    })

  })

})
