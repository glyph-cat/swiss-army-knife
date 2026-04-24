import { concatClassNames } from '.'

test(concatClassNames.name, () => {
  const LIST_OF_VALUES_TO_TEST = [
    ' ',
    ' a ',
    null,
    'b',
    '',
    ' c',
    undefined,
    '',
    'd',
    true,
    'true',
    'e',
    false,
    'false',
    0,
    'f ',
    ' ',
  ]
  const output = concatClassNames(...LIST_OF_VALUES_TO_TEST)
  expect(output).toBe('a b c d true e false 0 f')
})
