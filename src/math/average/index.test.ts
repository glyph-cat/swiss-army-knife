import { average } from '.'

test(average.name, (): void => {
  const output = average(1, 2, 3, 4, 5)
  expect(output).toBe(3)
})
