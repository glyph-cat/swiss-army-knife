import { NumericDataSet } from '.'
import { TypedFunction } from '../../types'
import { spyFn } from './test-utils'

let resetSpyFn: TypedFunction = null

beforeEach(() => {
  spyFn.current = jest.fn()
  // KIV: [Low priority] Why do previous call data still exist after calling mockClear???
  // resetSpyFn = (spyFn.current as jest.Mock).mockClear()
  resetSpyFn = () => { spyFn.current = jest.fn() }
  // KIV: Possibly a better solution? but how to configure properly?
  // jest.spyOn(NumericDataSet, 'prototype', 'get')
  // throws error "Property `prototype` is not declared configurable"
})

afterEach(() => {
  spyFn.current = null
  resetSpyFn = null
})

test('Constructor', () => {
  const ds = new NumericDataSet([17, 64, 73, 19, 81, 73, 49, 75, 65, 26, 30])
  expect(ds.values).toStrictEqual([17, 64, 73, 19, 81, 73, 49, 75, 65, 26, 30])
})

test('.sum', () => {
  const ds = new NumericDataSet([17, 64, 73, 19, 81, 73, 49, 75, 65, 26, 30])
  expect(spyFn.current).not.toHaveBeenCalled()
  // First read
  expect(ds.sum).toBe(572)
  expect(spyFn.current).toHaveBeenNthCalledWith(1, 'sum')
  expect(spyFn.current).toHaveBeenCalledTimes(1)
  // Second read: Value should not be recalculated
  resetSpyFn()
  expect(ds.sum).not.toBeUndefined()
  expect(spyFn.current).not.toHaveBeenCalled()
})

describe('.mean', (): void => {

  test('Sum has not been calculated', () => {
    const ds = new NumericDataSet([17, 64, 73, 19, 81, 73, 49, 75, 65, 26, 30])
    expect(spyFn.current).not.toHaveBeenCalled()
    // First read
    expect(ds.mean).toBe(52)
    expect(spyFn.current).toHaveBeenNthCalledWith(1, 'mean')
    expect(spyFn.current).toHaveBeenNthCalledWith(2, 'sum')
    expect(spyFn.current).toHaveBeenCalledTimes(2)
    // Second read: Value should not be recalculated
    resetSpyFn()
    expect(ds.mean).not.toBeUndefined()
    expect(spyFn.current).not.toHaveBeenCalled()
  })

  test('Sum has already been calculated', () => {
    // To make sure that repeated invocation don't tamper with already calculated value(s)
    const ds = new NumericDataSet([17, 64, 73, 19, 81, 73, 49, 75, 65, 26, 30])
    expect(ds.sum).not.toBeUndefined()
    resetSpyFn()
    expect(ds.mean).toBe(52)
    expect(spyFn.current).toHaveBeenNthCalledWith(1, 'mean')
    expect(spyFn.current).toHaveBeenCalledTimes(1)
  })

})

describe('.median', (): void => {

  test('Odd number data set', () => {
    const ds = new NumericDataSet([17, 64, 73, 19, 81, 73, 49, 75, 65, 26, 30].sort())
    expect(spyFn.current).not.toHaveBeenCalled()
    // First read
    expect(ds.median).toBe(64)
    expect(spyFn.current).toHaveBeenNthCalledWith(1, 'median')
    expect(spyFn.current).toHaveBeenCalledTimes(1)
    // Second read: Value should not be recalculated
    resetSpyFn()
    expect(ds.median).not.toBeUndefined()
    expect(spyFn.current).not.toHaveBeenCalled()
  })

  test('Even number data set', () => {
    const ds = new NumericDataSet([17, 64, 73, 19, 81, 73, 49, 75, 65, 26].sort())
    expect(spyFn.current).not.toHaveBeenCalled()
    // First read
    expect(ds.median).toBe(64.5)
    expect(spyFn.current).toHaveBeenNthCalledWith(1, 'median')
    expect(spyFn.current).toHaveBeenCalledTimes(1)
    // Second read: Value should not be recalculated
    resetSpyFn()
    expect(ds.median).not.toBeUndefined()
    expect(spyFn.current).not.toHaveBeenCalled()
  })

})

describe('.variance', (): void => {

  test('For population', () => {
    const ds = new NumericDataSet([17, 64, 73, 19, 81, 73, 49, 75, 65, 26, 30], {
      forPopulation: true,
    })
    expect(spyFn.current).not.toHaveBeenCalled()
    // First read
    expect(ds.variance).toBe(549.8181818181819)
    expect(spyFn.current).toHaveBeenNthCalledWith(1, 'variance')
    expect(spyFn.current).toHaveBeenNthCalledWith(2, 'mean')
    expect(spyFn.current).toHaveBeenNthCalledWith(3, 'sum')
    expect(spyFn.current).toHaveBeenCalledTimes(3)
    // Second read: Value should not be recalculated
    resetSpyFn()
    expect(ds.variance).not.toBeUndefined()
    expect(spyFn.current).not.toHaveBeenCalled()
  })

  test('For sample', () => {
    const ds = new NumericDataSet([17, 64, 73, 19, 81, 73, 49, 75, 65, 26, 30])
    expect(spyFn.current).not.toHaveBeenCalled()
    // First read
    expect(ds.variance).toBe(604.8)
    expect(spyFn.current).toHaveBeenNthCalledWith(1, 'variance')
    expect(spyFn.current).toHaveBeenNthCalledWith(2, 'mean')
    expect(spyFn.current).toHaveBeenNthCalledWith(3, 'sum')
    expect(spyFn.current).toHaveBeenCalledTimes(3)
    // Second read: Value should not be recalculated
    resetSpyFn()
    expect(ds.variance).not.toBeUndefined()
    expect(spyFn.current).not.toHaveBeenCalled()
  })

})

describe('.stddev', (): void => {

  test('For population', () => {
    const ds = new NumericDataSet([17, 64, 73, 19, 81, 73, 49, 75, 65, 26, 30], {
      forPopulation: true,
    })
    expect(spyFn.current).not.toHaveBeenCalled()
    // First read
    expect(ds.stddev).toBe(23.448202102041467)
    expect(spyFn.current).toHaveBeenNthCalledWith(1, 'stddev')
    expect(spyFn.current).toHaveBeenNthCalledWith(2, 'variance')
    expect(spyFn.current).toHaveBeenNthCalledWith(3, 'mean')
    expect(spyFn.current).toHaveBeenNthCalledWith(4, 'sum')
    expect(spyFn.current).toHaveBeenCalledTimes(4)
    // Second read: Value should not be recalculated
    resetSpyFn()
    expect(ds.stddev).not.toBeUndefined()
    expect(spyFn.current).not.toHaveBeenCalled()
  })

  test('For sample', () => {
    const ds = new NumericDataSet([17, 64, 73, 19, 81, 73, 49, 75, 65, 26, 30])
    expect(spyFn.current).not.toHaveBeenCalled()
    // First read
    expect(ds.stddev).toBe(24.592681838303037)
    expect(spyFn.current).toHaveBeenNthCalledWith(1, 'stddev')
    expect(spyFn.current).toHaveBeenNthCalledWith(2, 'variance')
    expect(spyFn.current).toHaveBeenNthCalledWith(3, 'mean')
    expect(spyFn.current).toHaveBeenNthCalledWith(4, 'sum')
    expect(spyFn.current).toHaveBeenCalledTimes(4)
    // Second read: Value should not be recalculated
    resetSpyFn()
    expect(ds.stddev).not.toBeUndefined()
    expect(spyFn.current).not.toHaveBeenCalled()
  })

})
