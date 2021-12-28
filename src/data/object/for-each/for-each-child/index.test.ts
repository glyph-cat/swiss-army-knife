import { forEachChild } from '.'

test(forEachChild.name, (): void => {
  const collection = {
    'id1': { value: 1 },
    'id2': { value: 2 },
    'id3': { value: 3 },
    'id4': { value: 4 },
  }
  const output = { concat: '', sum: 0 }
  forEachChild(collection, (key, child, breakLoop) => {
    output.concat += key
    output.sum += child.value
    if (output.sum >= 6) { breakLoop() }
  })
  expect(output).toStrictEqual({ concat: 'id1id2id3', sum: 6 })
})
