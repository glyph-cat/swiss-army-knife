import { getRandomHash } from '.'

test(getRandomHash.name, (): void => {
  const output = getRandomHash(8)
  expect(output).toBe('YYYYYYYY')
})
