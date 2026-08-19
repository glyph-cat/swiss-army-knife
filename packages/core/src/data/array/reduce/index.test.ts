import { asyncReduce } from '.'

test(asyncReduce.name, async () => {
  const spyFn = jest.fn()
  const array = ['a', 'b', 'c']
  const output = await asyncReduce(array, async (acc, value, index, $array) => {
    spyFn($array)
    acc.set(value, index)
    return acc
  }, new Map<string, number>())
  expect([...output.entries()]).toStrictEqual([
    ['a', 0],
    ['b', 1],
    ['c', 2],
  ])
  expect(spyFn).toHaveBeenCalledTimes(3)
  expect(spyFn).toHaveBeenNthCalledWith(1, array) // same reference
  expect(spyFn).toHaveBeenNthCalledWith(2, array) // same reference
  expect(spyFn).toHaveBeenNthCalledWith(3, array) // same reference
})
