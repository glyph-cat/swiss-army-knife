import { NumericDataSet } from '.'

// todo: come up with a more complex set of numbers

test('Constructor', () => {
  const ds = new NumericDataSet(1, 2, 3, 4, 5)
  expect(ds.values).toStrictEqual([1, 2, 3, 4, 5])
})

test('.sum', () => {
  const ds = new NumericDataSet(1, 2, 3, 4, 5)
  expect(ds.sum).toBe(15)
})

describe('.mean', (): void => {

  test('Sum has not been calculated', () => {
    const ds = new NumericDataSet(1, 2, 3, 4, 5)
    expect(ds.mean).toBe(3)
  })

  test('Sum has been calculated', () => {
    const ds = new NumericDataSet(1, 2, 3, 4, 5)
    expect(ds.sum).not.toBe(undefined)
    expect(ds.mean).toBe(3)
  })

})

test('.median', (): void => {
  const ds = new NumericDataSet(1, 2, 3, 4, 5)
  // todo
})

test('.stddev', (): void => {
  const ds = new NumericDataSet(1, 2, 3, 4, 5)
  // todo
})
