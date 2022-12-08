import { generateTestCollection } from '../test-helpers'
import { forEachInObjectToObject, forEachInObjectToObjectAsync } from '.'
import {
  BreakLoopSyntaxError,
  MismatchedBreakLoopError,
  MultipleBreakLoopError,
} from '../errors'

interface TestItem {
  index: number
  area: number
}

describe(forEachInObjectToObject.name, () => {

  test('Happy path', () => {
    const collection = generateTestCollection()
    const output: Record<string, TestItem> = forEachInObjectToObject(collection, ({ index, key, value, breakLoop, NOTHING }) => {
      if (index === 2) {
        return NOTHING
      } else {
        if (index === 4) { return breakLoop() }
        return [key, {
          index,
          area: value.height * value.width,
        }]
      }
    })
    expect(output).toStrictEqual({
      a: { index: 0, area: 200 },
      b: { index: 1, area: 1500 },
      d: { index: 3, area: 2400 },
    })
  })

  test('Incorrect break loop syntax', () => {
    const collection = generateTestCollection()
    const callback = () => {
      forEachInObjectToObject(collection, ({ index, key, value, breakLoop }) => {
        breakLoop()
        return [key, {
          index,
          area: value.height * value.width,
        }]
      })
    }
    expect(callback).toThrow(BreakLoopSyntaxError)
  })

  test('Mismatched break loop', () => {
    const collection = generateTestCollection()
    const callback = () => {
      forEachInObjectToObject(collection, ({ breakLoop, NOTHING }) => {
        forEachInObjectToObject(collection, () => {
          return breakLoop()
        })
        return NOTHING
      })
    }
    expect(callback).toThrow(MismatchedBreakLoopError)
  })

  test('Multiple breaks', () => {
    const collection = generateTestCollection()
    const callback = () => {
      forEachInObjectToObject(collection, ({ breakLoop }) => {
        breakLoop()
        return breakLoop()
      })
    }
    expect(callback).toThrow(MultipleBreakLoopError)
  })

})

describe(forEachInObjectToObjectAsync.name, () => {

  jest.useRealTimers()

  test('Happy path', async () => {
    const collection = generateTestCollection()
    const output: Record<string, TestItem> = await forEachInObjectToObjectAsync(collection, async ({ index, key, value, breakLoop, NOTHING }) => {
      if (index === 2) {
        return NOTHING
      } else {
        if (index === 4) { return breakLoop() }
        return [key, {
          index,
          area: value.height * value.width,
        }]
      }
    })
    expect(output).toStrictEqual({
      a: { index: 0, area: 200 },
      b: { index: 1, area: 1500 },
      d: { index: 3, area: 2400 },
    })
  })

  test('Incorrect break loop syntax', async () => {
    const collection = generateTestCollection()
    const callback = async () => {
      await forEachInObjectToObjectAsync(collection, async ({ index, key, value, breakLoop }) => {
        breakLoop()
        return [key, {
          index,
          area: value.height * value.width,
        }]
      })
    }
    await expect(callback).rejects.toThrow(BreakLoopSyntaxError)
  })

  test('Mismatched break loop', async () => {
    const collection = generateTestCollection()
    const callback = async () => {
      await forEachInObjectToObjectAsync(collection, async ({ breakLoop, NOTHING }) => {
        await forEachInObjectToObjectAsync(collection, async () => {
          return breakLoop()
        })
        return NOTHING
      })
    }
    await expect(callback).rejects.toThrow(MismatchedBreakLoopError)
  })

  test('Multiple breaks', async () => {
    const collection = generateTestCollection()
    const callback = async () => {
      await forEachInObjectToObjectAsync(collection, async ({ breakLoop }) => {
        breakLoop()
        return breakLoop()
      })
    }
    await expect(callback).rejects.toThrow(MultipleBreakLoopError)
  })

})
