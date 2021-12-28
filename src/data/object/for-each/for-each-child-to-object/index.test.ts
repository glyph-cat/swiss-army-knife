import { EMPTY_OBJECT } from '../../../dummies'
import { forEachChildToObject } from '.'

const collection = {
  'id1': { value: 1 },
  'id2': { value: 2 },
  'id3': { value: 3 },
  'id4': { value: 4 },
  'id5': { value: 5 },
}

describe(forEachChildToObject.name, (): void => {

  test('Without key mapper', () => {
    const output = forEachChildToObject(collection, (_key, child, breakLoop) => {
      if (child.value === 2) {
        return EMPTY_OBJECT
      } else {
        if (child.value === 4) { breakLoop() }
        return { value: child.value * 2 }
      }
    })
    expect(output).toStrictEqual({
      'id1': { value: 2 },
      'id3': { value: 6 },
      'id4': { value: 8 },
    })
  })

  test('With key mapper', () => {
    const output = forEachChildToObject(collection, (_key, child, breakLoop) => {
      if (child.value === 2) {
        return EMPTY_OBJECT
      } else {
        if (child.value === 4) { breakLoop() }
        return { value: child.value * 2 }
      }
    }, (key) => key.replace('id', ''))
    expect(output).toStrictEqual({
      '1': { value: 2 },
      '3': { value: 6 },
      '4': { value: 8 },
    })
  })

})
