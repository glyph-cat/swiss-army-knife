import { MultipleBreakLoopError } from '../errors'
import { generateTestCollection } from '../test-helpers'
import { forEachInObject, forEachInObjectAsync } from '.'

describe(forEachInObject.name, () => {

  test('Happy path', () => {
    const collection = generateTestCollection()
    let concatenatedIndices = ''
    let concatenatedKeys = ''
    let totalArea = 0
    forEachInObject(collection, ({ index, key, value, breakLoop }) => {
      concatenatedIndices += index
      concatenatedKeys += key
      totalArea += (value.height * value.width)
      if (concatenatedKeys.length >= 3) { return breakLoop() }
    })
    expect(concatenatedIndices).toBe('012')
    expect(concatenatedKeys).toBe('abc')
    expect(totalArea).toBe(2300)
  })

  test('Multiple breaks', () => {
    const collection = generateTestCollection()
    const callback = () => {
      forEachInObject(collection, ({ breakLoop }) => {
        breakLoop()
        return breakLoop()
      })
    }
    expect(callback).toThrow(MultipleBreakLoopError)
  })

})

describe(forEachInObjectAsync.name, () => {

  jest.useRealTimers()

  test('Happy path', async () => {
    const collection = generateTestCollection()
    let concatenatedIndices = ''
    let concatenatedKeys = ''
    let totalArea = 0
    await forEachInObjectAsync(collection, async ({ index, key, value, breakLoop }) => {
      concatenatedIndices += index
      concatenatedKeys += key
      totalArea += (value.height * value.width)
      if (concatenatedKeys.length >= 3) { return breakLoop() }
    })
    expect(concatenatedIndices).toBe('012')
    expect(concatenatedKeys).toBe('abc')
    expect(totalArea).toBe(2300)
  })

  test('Multiple breaks', async () => {
    const collection = generateTestCollection()
    const callback = async () => {
      await forEachInObjectAsync(collection, async ({ breakLoop }) => {
        breakLoop()
        return breakLoop()
      })
    }
    await expect(callback).rejects.toThrow(MultipleBreakLoopError)
  })

})
