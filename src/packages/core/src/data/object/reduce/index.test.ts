import { createRef } from '@glyph-cat/foundation'
import { objectReduce } from '.'

test(objectReduce.name, () => {

  const obj = {
    foo: 123,
    bar: 456,
    baz: 789,
  }

  interface ITestAccumulator {
    currentValue: typeof obj[keyof typeof obj]
    currentKey: keyof typeof obj
    currentIndex: number
  }

  const objectRef = createRef<typeof obj>(null)

  const output = objectReduce(obj, (previousValue, currentValue, currentKey, currentIndex, object) => {
    if (currentIndex === 0) {
      objectRef.current = object
    }
    previousValue.push({
      currentValue,
      currentKey,
      currentIndex,
    })
    return previousValue
  }, [] as Array<ITestAccumulator>)

  expect(Object.is(objectRef.current, obj)).toBe(true)
  expect(output).toStrictEqual([
    {
      currentValue: 123,
      currentKey: 'foo',
      currentIndex: 0,
    },
    {
      currentValue: 456,
      currentKey: 'bar',
      currentIndex: 1,
    },
    {
      currentValue: 789,
      currentKey: 'baz',
      currentIndex: 2,
    },
  ])

})
