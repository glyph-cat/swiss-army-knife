import { concatClassNames } from '.'

test(concatClassNames.name, () => {
  const output = concatClassNames(' ', 'a ', null, 'b', '', ' c', undefined, 'd', ' ')
  expect(output).toBe('a b c d')
})
