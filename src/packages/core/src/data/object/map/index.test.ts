import { createRef } from '@glyph-cat/foundation'
import { objectMap } from '.'

test(objectMap.name, () => {
  const obj = {
    foo: 123,
    bar: 456,
    baz: 789,
  }
  const objectRef = createRef<typeof obj>(null)
  const output = objectMap(obj, (value, key, index, object) => {
    if (index === 0) {
      objectRef.current = object
    }
    return { key, value, index }
  })
  expect(Object.is(objectRef.current, obj)).toBe(true)
  expect(output).toStrictEqual([
    { key: 'foo', value: 123, index: 0 },
    { key: 'bar', value: 456, index: 1 },
    { key: 'baz', value: 789, index: 2 },
  ])
})
