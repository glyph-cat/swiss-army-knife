import { pickLast } from '.'

test(pickLast.name, () => {
  expect(pickLast(['a', 'b', 'c', 'd'])).toBe('d')
  expect(pickLast(['a', 'b', 'c', 'd'], 1)).toBe('c')
  expect(pickLast([])).toBe(undefined)
})
