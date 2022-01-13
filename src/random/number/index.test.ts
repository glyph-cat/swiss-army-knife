import { getRandomNumber } from '.'

test(getRandomNumber.name, (): void => {
  const output = getRandomNumber(0, 10)
  expect(output).toBe(4)
})
