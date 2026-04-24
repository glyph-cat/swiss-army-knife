import { getPaginationSpecs } from '.'

describe(getPaginationSpecs.name, () => {

  test('pageSize = 10', () => {
    expect(getPaginationSpecs(10, 0)).toStrictEqual([0, 9])
    expect(getPaginationSpecs(10, 1)).toStrictEqual([10, 19])
    expect(getPaginationSpecs(10, 2)).toStrictEqual([20, 29])
    expect(getPaginationSpecs(10, 3)).toStrictEqual([30, 39])
  })

  test('pageSize = 25', () => {
    expect(getPaginationSpecs(25, 0)).toStrictEqual([0, 24])
    expect(getPaginationSpecs(25, 1)).toStrictEqual([25, 49])
    expect(getPaginationSpecs(25, 2)).toStrictEqual([50, 74])
    expect(getPaginationSpecs(25, 3)).toStrictEqual([75, 99])
  })

})
