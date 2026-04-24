import { Nullable, StringRecord } from '@glyph-cat/foundation'
import { IS_DEBUG_ENV } from '@glyph-cat/swiss-army-knife'
import { isNumber } from '@glyph-cat/type-checking'
import { createContext, useContext } from 'react'

/**
 * @internal
 */
export const TestProbeProvider = createContext<Nullable<TestProbe>>(null)

/**
 * @internal
 */
export function useTestProbe(key: string): void {
  if (!IS_DEBUG_ENV) {
    return // Early exit
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const testProbe = useContext(TestProbeProvider)
  if (!testProbe) {
    return // Early exit - not mandatory
    // throw new Error('Component must be wrapped in a <TestProbeProvider>')
  }
  if (!key) {
    throw new Error('Missing mandatory parameter `key`')
  }
  testProbe.M$bumpRenderCount(key)
}

/**
 * @internal
 */
export class TestProbe {

  private readonly M$allRenderCount: StringRecord<number> = {}

  /**
   * @internal
   */
  M$bumpRenderCount(key: string): void {
    if (!isNumber(this.M$allRenderCount[key])) {
      this.M$allRenderCount[key] = 0
    }
    this.M$allRenderCount[key] += 1
  }

  get allRenderCount(): StringRecord<number> {
    return { ...this.M$allRenderCount }
  }

  getRenderCount(key: string): Nullable<number> {
    return this.M$allRenderCount[key] ?? null
  }

}
