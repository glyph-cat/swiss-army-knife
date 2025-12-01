import { getPageLayoutOrder } from '.'

test('1 Paper', () => {
  expect(getPageLayoutOrder(1)).toStrictEqual([[[null, 1], [null, null]]])
  expect(getPageLayoutOrder(2)).toStrictEqual([[[null, 1], [2, null]]])
  expect(getPageLayoutOrder(3)).toStrictEqual([[[null, 1], [2, 3]]])
  expect(getPageLayoutOrder(4)).toStrictEqual([[[4, 1], [2, 3]]])
})

test('2 Papers', () => {
  expect(getPageLayoutOrder(5)).toStrictEqual([
    [[null, 1], [2, null]],
    [[null, 3], [4, 5]]
  ])
  expect(getPageLayoutOrder(6)).toStrictEqual([
    [[null, 1], [2, null]],
    [[6, 3], [4, 5]]
  ])
  expect(getPageLayoutOrder(7)).toStrictEqual([
    [[null, 1], [2, 7]],
    [[6, 3], [4, 5]]
  ])
  expect(getPageLayoutOrder(8)).toStrictEqual([
    [[8, 1], [2, 7]],
    [[6, 3], [4, 5]]
  ])
})

test('Other arbitrary number of papers', () => {
  expect(getPageLayoutOrder(11)).toStrictEqual([
    [[null, 1], [2, 11]],
    [[10, 3], [4, 9]],
    [[8, 5], [6, 7]],
  ])
  expect(getPageLayoutOrder(16)).toStrictEqual([
    [[16, 1], [2, 15]],
    [[14, 3], [4, 13]],
    [[12, 5], [6, 11]],
    [[10, 7], [8, 9]],
  ])
  expect(getPageLayoutOrder(20)).toStrictEqual([
    [[20, 1], [2, 19]],
    [[18, 3], [4, 17]],
    [[16, 5], [6, 15]],
    [[14, 7], [8, 13]],
    [[12, 9], [10, 11]],
  ])
  expect(getPageLayoutOrder(37)).toStrictEqual([
    [[null, 1], [2, null]],
    [[null, 3], [4, 37]],
    [[36, 5], [6, 35]],
    [[34, 7], [8, 33]],
    [[32, 9], [10, 31]],
    [[30, 11], [12, 29]],
    [[28, 13], [14, 27]],
    [[26, 15], [16, 25]],
    [[24, 17], [18, 23]],
    [[22, 19], [20, 21]],
  ])
})
