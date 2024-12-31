import { removeDuplicates } from '.'

describe(removeDuplicates.name, (): void => {

  test('Originally containing no duplicates', (): void => {
    const output = removeDuplicates([1, 2, 3, 4])
    expect(output).toStrictEqual([1, 2, 3, 4])
  })

  test('Originally containing duplicates', (): void => {
    const output = removeDuplicates([1, 2, 2, 2, 3, 2, 2, 3, 4, 4, 1])
    expect(output).toStrictEqual([1, 2, 3, 4])
  })

})
