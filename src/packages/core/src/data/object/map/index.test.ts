import { objectMap } from '.'
import { createRef } from '../../ref'

test(objectMap.name, () => {
  const obj = {
    foo: 123,
    bar: 456,
    baz: 789,
  }
  const output = objectMap(obj, (value, key, index) => ({ key, value, index }))
  expect(output).toStrictEqual([
    { key: 'foo', value: 123, index: 0 },
    { key: 'bar', value: 456, index: 1 },
    { key: 'baz', value: 789, index: 2 },
  ])
})

test('Reference to original object gets passed down', () => {
  const sourceObject = { _: null }
  const objectRef = createRef<typeof sourceObject>(null)
  objectMap(sourceObject, (_0, _1, _2, objRef) => {
    objectRef.current = objRef
  })
  expect(Object.is(objectRef.current, sourceObject)).toBe(true)
})
