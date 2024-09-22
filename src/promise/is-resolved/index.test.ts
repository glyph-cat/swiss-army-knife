import { isResolved } from '.'
import { delay } from '../../events/delay'

describe(isResolved.name, (): void => {

  jest.useRealTimers()

  test('With flag', async (): Promise<void> => {

    const examplePromise = delay(50)
    const flag = { current: false }

    const output1 = isResolved(examplePromise, flag)
    expect(output1).toBe(undefined)
    expect(flag.current).toBe(false)

    await delay(50)
    const output2 = isResolved(examplePromise, flag)
    expect(output2).toBe(undefined)
    expect(flag.current).toBe(true)

  })

  test('Without flag', async (): Promise<void> => {
    const examplePromise = delay(50)
    expect(await isResolved(examplePromise)).toBe(false)
    await delay(50)
    expect(await isResolved(examplePromise)).toBe(true)
  })

})
