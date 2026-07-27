import { chunk } from '.'

test(chunk.name, (): void => {
  const output = chunk(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 3)
  expect(output).toStrictEqual([['a', 'b', 'c'], ['d', 'e', 'f'], ['g']])
})
