import { EMPTY_OBJECT } from '../../../dummies'
import { forEachChildToArray } from '.'

test(forEachChildToArray.name, (): void => {
  const collection = {
    'id1': { value: 1 },
    'id2': { value: 2 },
    'id3': { value: 3 },
    'id4': { value: 4 },
    'id5': { value: 5 },
  }
  const output = forEachChildToArray(collection, (key, child, breakLoop) => {
    if (child.value === 2) {
      return EMPTY_OBJECT
    } else {
      if (child.value === 4) { breakLoop() }
      return { id: key, value: child.value }
    }
  })
  expect(output).toStrictEqual([
    { id: 'id1', value: 1 },
    { id: 'id3', value: 3 },
    { id: 'id4', value: 4 },
  ])
})
