import { getRandomNumber } from '.'

test(getRandomNumber.name, (): void => {
  const output = getRandomNumber(5, 10)
  expect(output).toBe(7)
})
