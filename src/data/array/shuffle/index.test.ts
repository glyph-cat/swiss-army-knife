import { shuffle } from '.'

test(shuffle.name, (): void => {
  const output = shuffle([1, 2, 3, 4, 5])
  expect(output).toStrictEqual([5, 1, 4, 2, 3])
})

