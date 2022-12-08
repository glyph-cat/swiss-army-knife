import {
  BreakLoopSyntaxError,
  MismatchedBreakLoopError,
  MultipleBreakLoopError,
} from '../errors'
import { generateTestCollection } from '../test-helpers'
import { forEachInObjectToArray, forEachInObjectToArrayAsync } from '.'

interface TestItem {
  index: number
  key: string
  area: number
}

describe(forEachInObjectToArray.name, () => {

  test('Happy path', () => {
    const collection = generateTestCollection()
    const output: Array<TestItem> = forEachInObjectToArray(collection, ({ index, key, value, breakLoop, NOTHING }) => {
      if (index === 2) {
        return NOTHING
      } else {
        if (index === 4) { return breakLoop() }
        return {
          index,
          key,
          area: value.height * value.width,
        }
      }
    })
    expect(output).toStrictEqual([
      { index: 0, key: 'a', area: 200 },
      { index: 1, key: 'b', area: 1500 },
      { index: 3, key: 'd', area: 2400 },
    ])
  })

  test('Incorrect break loop syntax', () => {
    const collection = generateTestCollection()
    const callback = () => {
      forEachInObjectToArray(collection, ({ breakLoop }) => {
        breakLoop()
        return
      })
    }
    expect(callback).toThrow(BreakLoopSyntaxError)
  })

  test('Mismatched break loop', () => {
    const collection = generateTestCollection()
    const callback = () => {
      forEachInObjectToArray(collection, ({ breakLoop }) => {
        forEachInObjectToArray(collection, () => {
          return breakLoop()
        })
      })
    }
    expect(callback).toThrow(MismatchedBreakLoopError)
  })

  test('Multiple breaks', () => {
    const collection = generateTestCollection()
    const callback = () => {
      forEachInObjectToArray(collection, ({ breakLoop }) => {
        breakLoop()
        return breakLoop()
      })
    }
    expect(callback).toThrow(MultipleBreakLoopError)
  })

})

describe(forEachInObjectToArrayAsync.name, () => {

  jest.useRealTimers()

  test('Happy path', async () => {
    const collection = generateTestCollection()
    const output: Array<TestItem> = await forEachInObjectToArrayAsync(collection, async ({ index, key, value, breakLoop, NOTHING }) => {
      if (index === 2) {
        return NOTHING
      } else {
        if (index === 4) { return breakLoop() }
        return {
          index,
          key,
          area: value.height * value.width,
        }
      }
    })
    expect(output).toStrictEqual([
      { index: 0, key: 'a', area: 200 },
      { index: 1, key: 'b', area: 1500 },
      { index: 3, key: 'd', area: 2400 },
    ])
  })

  test('Incorrect break loop syntax', async () => {
    const collection = generateTestCollection()
    const callback = async () => {
      await forEachInObjectToArrayAsync(collection, async ({ breakLoop }) => {
        breakLoop()
        return
      })
    }
    expect(callback).rejects.toThrow(BreakLoopSyntaxError)
  })

  test('Mismatched break loop', async () => {
    const collection = generateTestCollection()
    const callback = async () => {
      await forEachInObjectToArrayAsync(collection, async ({ breakLoop }) => {
        await forEachInObjectToArrayAsync(collection, async () => {
          return breakLoop()
        })
      })
    }
    expect(callback).rejects.toThrow(MismatchedBreakLoopError)
  })

  test('Multiple breaks', async () => {
    const collection = generateTestCollection()
    const callback = async () => {
      await forEachInObjectToArrayAsync(collection, ({ breakLoop }) => {
        breakLoop()
        return breakLoop()
      })
    }
    expect(callback).rejects.toThrow(MultipleBreakLoopError)
  })

})
