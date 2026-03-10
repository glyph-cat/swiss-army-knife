import { createRef } from '@glyph-cat/foundation'
import { isResolved } from '.'
import { delay } from '../../events/delay'

describe(isResolved.name, (): void => {

  jest.useRealTimers()

  test('With flag', async (): Promise<void> => {

    const examplePromise = delay(50)
    const flag = createRef(false)

    const output1 = isResolved(examplePromise, flag)
    expect(output1).toBe(undefined)
    expect(flag.current).toBeFalse()

    await delay(50)
    const output2 = isResolved(examplePromise, flag)
    expect(output2).toBe(undefined)
    expect(flag.current).toBeTrue()

  })

  test('Without flag', async (): Promise<void> => {
    const examplePromise = delay(50)
    expect(await isResolved(examplePromise)).toBeFalse()
    await delay(50)
    expect(await isResolved(examplePromise)).toBeTrue()
  })

})
