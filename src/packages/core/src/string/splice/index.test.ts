import { splice } from '.'

test(splice.name, () => {
  expect(splice('0123456789', 3, 2, 'x', 'y', 'z')).toStrictEqual([
    '012xyz56789',
    '34',
  ])
})
