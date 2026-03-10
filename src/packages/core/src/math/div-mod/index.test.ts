import { divMod } from '.'

test('With remainder', () => {
  expect(divMod(9, 2)).toStrictEqual([4, 1])
})

test('Without remainder', () => {
  expect(divMod(100, 20)).toStrictEqual([5, 0])
})
