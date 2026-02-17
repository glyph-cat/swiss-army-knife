import { createRef } from '@glyph-cat/foundation'
import { objectFilter } from '.'

test(objectFilter.name, () => {
  const obj = {
    k1: 0,
    k2: 20,
    k3: 40,
    k4: 60,
    k5: 80,
    k6: 100,
  }
  const objectRef = createRef<typeof obj>(null)
  const output = objectFilter(obj, (value, key, index, object) => {
    if (index === 0) {
      objectRef.current = object
    }
    return key === 'k1' || value > 50
  })
  expect(Object.is(objectRef.current, obj)).toBe(true)
  expect(output).toStrictEqual({
    k1: 0,
    k4: 60,
    k5: 80,
    k6: 100,
  })
})
