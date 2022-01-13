import { MutableRefObject } from 'react'
import { areDepsEqual, deepMemoize, memoize } from '.'

describe(areDepsEqual.name, (): void => {

  describe('true', (): void => {

    test('Primitive types', (): void => {
      const deps1 = [42, true, 'foo']
      const deps2 = [42, true, 'foo']
      expect(areDepsEqual(deps1, deps2)).toBe(true)
    })

    test('Object types', (): void => {
      const arr = []
      const obj = {}
      const deps1 = [arr, obj]
      const deps2 = [arr, obj]
      expect(areDepsEqual(deps1, deps2)).toBe(true)
    })

  })

  describe('false', (): void => {

    test('Primitive types', (): void => {
      const deps1 = [42, false, 'foo']
      const deps2 = [42, true, 'bar']
      expect(areDepsEqual(deps1, deps2)).toBe(false)
    })

    test('Object types', (): void => {
      const arr = []
      const obj = {}
      const deps1 = [arr, obj]
      const deps2 = [arr, {}]
      expect(areDepsEqual(deps1, deps2)).toBe(false)
    })

    test('Different length', (): void => {
      const deps1 = [42, true, 'foo']
      const deps2 = [42, true]
      expect(areDepsEqual(deps1, deps2)).toBe(false)
    })

  })

})

test(memoize.name, (): void => {

  const add = jest.fn((num1: number, num2: number): number => num1 + num2)
  const memoizedAdd = memoize(add)

  memoizedAdd(1, 2)
  expect(add).toHaveBeenNthCalledWith(1, 1, 2)

  memoizedAdd(1, 2)
  expect(add).toHaveBeenNthCalledWith(1, 1, 2)

  memoizedAdd(3, 4)
  expect(add).toHaveBeenNthCalledWith(2, 3, 4)

  memoizedAdd(1, 2)
  expect(add).toHaveBeenNthCalledWith(3, 1, 2)

})

test(deepMemoize.name, (): void => {

  const add = jest.fn((num1: number, num2: number): number => num1 + num2)
  const cacheSpy: MutableRefObject<Array<[[number, number], number]>> = {
    current: null,
  }
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
