import { getRandomHash } from '.'

test(getRandomHash.name, (): void => {
  const output = getRandomHash(8)
  expect(output).toMatch(/^[a-z0-9]{8}$/i)
})
