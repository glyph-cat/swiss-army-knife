import { multilineTrim, trim } from '.'

test(trim.name, () => {
  expect(trim(' \t\nhello \t\n ')).toBe('hello')
})

test(multilineTrim.name, () => {
  // NOTE: `JSON.stringify` is used because it is easier to read and compare
  // the differences when reported by jest.
  expect(JSON.stringify(multilineTrim([
    ' ',
    ' hello\t\t',
    '',
    '\t world',
    '',
    '',
    '\tfoo bar  ',
    ' ',
  ].join('\n')))).toBe(JSON.stringify([
    'hello',
    '',
    'world',
    '',
    '',
    'foo bar',
  ].join('\n')))
})
