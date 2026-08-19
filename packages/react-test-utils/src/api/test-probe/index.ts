import { Nullable } from '@glyph-cat/foundation'
import { isNumber } from '@glyph-cat/type-checking'
import { createContext, useContext } from 'react'

/**
 * @public
 */
export const TestProbeContext = createContext<Nullable<TestProbe>>(null)

/**
 * CAUTION: You should configure your bundler or create a custom plugin to
 * strip away calls made to this hook before shipping as production-ready.
 * @public
 */
export function useTestProbe(ref: Exclude<unknown, void | undefined | null>): void {
  const testProbe = useContext(TestProbeContext)
  testProbe?.M$bumpRenderCount(ref)
}

/**
 * @public
 */
export class TestProbe {

  private readonly M$allRenderCount = new Map<Exclude<unknown, void | undefined | null>, number>()

  /**
   * @internal
   */
  M$bumpRenderCount(ref: Exclude<unknown, void | undefined | null>): void {
    const refValue = this.M$allRenderCount.get(ref)
    if (isNumber(refValue)) {
      this.M$allRenderCount.set(ref, refValue + 1)
    } else {
      this.M$allRenderCount.set(ref, 1)
    }
  }

  get allRenderCount(): Map<Exclude<unknown, void | undefined | null>, number> {
    return new Map(this.M$allRenderCount)
  }

  getRenderCount(ref: Exclude<unknown, void | undefined | null>): Nullable<number> {
    return this.M$allRenderCount.get(ref) ?? null
  }

}
