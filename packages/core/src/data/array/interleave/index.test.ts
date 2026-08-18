import { interleave } from '.'

test(interleave.name, (): void => {
  const output = interleave(['a', 'b', 'c'], ['d', 'e', 'f'], ['g'])
  expect(output).toStrictEqual(['a', 'd', 'g', 'b', 'e', 'c', 'f'])
})
