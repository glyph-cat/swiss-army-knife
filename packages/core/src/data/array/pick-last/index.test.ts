import { pickLast, pickLastWhere } from '.'
import { isEven } from '../../../math'

test(pickLast.name, () => {
  expect(pickLast(['a', 'b', 'c', 'd'])).toBe('d')
  expect(pickLast(['a', 'b', 'c', 'd'], 1)).toBe('c')
  expect(pickLast([])).toBe(undefined)
})

describe(pickLastWhere.name, () => {

  test('Common scenario, match found', () => {
    const searchFn = jest.fn((value: number) => isEven(value))
    const output = pickLastWhere([2, 4, 5, 7], searchFn)
    expect(output).toBe(4)
    expect(searchFn).toHaveBeenCalledTimes(3)
    expect(searchFn).toHaveBeenNthCalledWith(1, 7, 3)
    expect(searchFn).toHaveBeenNthCalledWith(2, 5, 2)
    expect(searchFn).toHaveBeenNthCalledWith(3, 4, 1)
  })

  test('Common scenario, no match found', () => {
    const searchFn = jest.fn((value: number) => isEven(value))
    const output = pickLastWhere([1, 3, 5, 7], searchFn)
    expect(output).toBeNull()
    expect(searchFn).toHaveBeenCalledTimes(4)
    expect(searchFn).toHaveBeenNthCalledWith(1, 7, 3)
    expect(searchFn).toHaveBeenNthCalledWith(2, 5, 2)
    expect(searchFn).toHaveBeenNthCalledWith(3, 3, 1)
    expect(searchFn).toHaveBeenNthCalledWith(4, 1, 0)
  })

  test('Array has 1 item only', () => {
    const output = pickLastWhere([2], (value: number) => isEven(value))
    expect(output).toBe(2)
  })

  test('Array is empty', () => {
    const output = pickLastWhere([], (value: number) => isEven(value))
    expect(output).toBe(null)
  })

})
