import { multilineTrim, trim } from '.'

test(trim.name, () => {
  expect(trim(' \t\nhello \t\n ')).toBe('hello')
})

test(multilineTrim.name, () => {
  expect(multilineTrim([
    ' hello\t\t',
    '',
    '\t world',
    '',
    '',
    '\tfoo bar  ',
  ].join('\n'))).toBe([
    'hello',
    '',
    'world',
    '',
    '',
    'foo bar',
  ].join('\n'))
})
