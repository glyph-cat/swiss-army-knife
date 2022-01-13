import { sum } from '.'

test(sum.name, (): void => {
  const output = sum(1, 2, 3, 4, 5)
  expect(output).toBe(15)
})
