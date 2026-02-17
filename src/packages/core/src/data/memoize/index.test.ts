import { isJSONequal } from '@glyph-cat/equality'
import { createRef, Value2D } from '@glyph-cat/foundation'
import { deepMemoize, memoize } from '.'

describe(memoize.name, (): void => {

  test('Simple', () => {

    const add = jest.fn((num1: number, num2: number): number => num1 + num2)
    const memoizedAdd = memoize(add)

    expect(memoizedAdd(1, 2)).toBe(3)
    expect(add).toHaveBeenCalledTimes(1)
    expect(add).toHaveBeenNthCalledWith(1, 1, 2)

    expect(memoizedAdd(1, 2)).toBe(3)
    expect(add).toHaveBeenCalledTimes(1)
    expect(add).toHaveBeenNthCalledWith(1, 1, 2)

    expect(memoizedAdd(3, 4)).toBe(7)
    expect(add).toHaveBeenCalledTimes(2)
    expect(add).toHaveBeenNthCalledWith(2, 3, 4)

    expect(memoizedAdd(1, 2)).toBe(3)
    expect(add).toHaveBeenCalledTimes(3)
    expect(add).toHaveBeenNthCalledWith(3, 1, 2)

  })

  test('Complex', () => {

    const addX = jest.fn((p1: Value2D, p2: Value2D): number => p1.x + p2.x)
    const memoizedAddX = memoize(addX, (a, b) => {
      const [prevP1, prevP2] = a
      const [nextP1, nextP2] = b
      return isJSONequal(prevP1, nextP1) && isJSONequal(prevP2, nextP2)
    })

    expect(memoizedAddX({ x: 1, y: 2 }, { x: 2, y: 2 })).toBe(3)
    expect(addX).toHaveBeenCalledTimes(1)

    expect(memoizedAddX({ x: 1, y: 2 }, { x: 2, y: 2 })).toBe(3)
    expect(addX).toHaveBeenCalledTimes(1)

    expect(memoizedAddX({ x: 3, y: 2 }, { x: 4, y: 2 })).toBe(7)
    expect(addX).toHaveBeenCalledTimes(2)

    expect(memoizedAddX({ x: 1, y: 2 }, { x: 2, y: 2 })).toBe(3)
    expect(addX).toHaveBeenCalledTimes(3)

  })

})

test(deepMemoize.name, (): void => {

  const add = jest.fn((num1: number, num2: number): number => num1 + num2)
  const cacheSpy = createRef<Array<[[number, number], number]>>(null)
  const memoizedAdd = deepMemoize(add, 2, cacheSpy)

  memoizedAdd(1, 2)
  expect(add).toHaveBeenNthCalledWith(1, 1, 2)
  expect(cacheSpy.current).toStrictEqual([
    [[1, 2], 3],
  ])

  memoizedAdd(1, 2)
  expect(add).toHaveBeenNthCalledWith(1, 1, 2)
  expect(cacheSpy.current).toStrictEqual([
    [[1, 2], 3],
  ])

  memoizedAdd(3, 4)
  expect(add).toHaveBeenNthCalledWith(2, 3, 4)
  expect(cacheSpy.current).toStrictEqual([
    [[3, 4], 7],
    [[1, 2], 3],
  ])

  memoizedAdd(1, 2)
  expect(add).toHaveBeenNthCalledWith(2, 3, 4) // Because [1, 2] is still cached
  expect(cacheSpy.current).toStrictEqual([
    [[3, 4], 7],
    [[1, 2], 3],
  ])

  memoizedAdd(5, 6)
  expect(add).toHaveBeenNthCalledWith(3, 5, 6)
  expect(cacheSpy.current).toStrictEqual([
    [[5, 6], 11],
    [[3, 4], 7],
  ])

  memoizedAdd(1, 2)
  expect(add).toHaveBeenNthCalledWith(4, 1, 2)
  expect(cacheSpy.current).toStrictEqual([
    [[1, 2], 3],
    [[5, 6], 11],
  ])

})
