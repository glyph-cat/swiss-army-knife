import { clientOnly } from '../../client-only'
import { createRef } from '../../data'
import { CleanupFunction, IDisposable, PossiblyUndefined } from '../../types'
import { ExtendedCSSProperties } from '../abstractions'
import { addStyles, PrecedenceLevel } from '../add-styles'
import { compileStyle } from '../compile-styles'
import { StyleMap } from '../style-map'

/**
 * @public
 */
export class StyleManager extends StyleMap implements IDisposable {

  /**
   * @internal
   */
  private readonly M$cache = new Map<string, string>()

  /**
   * @internal
   */
  private readonly M$removeStyles: PossiblyUndefined<CleanupFunction>

  readonly element: HTMLStyleElement

  constructor(
    initialStyles: Iterable<readonly [string, ExtendedCSSProperties]> = [],
    readonly precedenceLevel?: PrecedenceLevel,
  ) {
    super() // KIV
    // For some reason, passing `initialStyles` to `super()` would cause the
    // `.set` method of this child class to be invoked, rather than the super class.
    // Update: This problem is tricky and niche, there seems to be a post on S.O.
    // https://stackoverflow.com/questions/77689581/how-to-avoid-inherited-methods-in-call-by-super-constructor-keyword?noredirect=1&lq=1
    const styleElementRef = createRef<HTMLStyleElement>(null)
    this.M$removeStyles = clientOnly(() => addStyles(
      this.M$getCompiledStyles(),
      precedenceLevel,
      styleElementRef,
    ))
    this.element = styleElementRef.current
    for (const [key, value] of initialStyles) {
      this.set(key, value)
    }
  }

  set(key: string, value: ExtendedCSSProperties): this {
    super.set(key, value)
    this.M$cache.set(key, compileStyle(key, value))
    this.element.innerHTML = this.M$getCompiledStyles()
    return this
  }

  delete(key: string): boolean {
    const payload = super.delete(key)
    this.M$cache.delete(key)
    this.element.innerHTML = this.M$getCompiledStyles()
    return payload
  }

  clear(): void {
    super.clear()
    this.M$cache.clear()
    this.element.innerHTML = ''
  }

  dispose(): void {
    this.clear()
    this.M$cache.clear()
    this.M$removeStyles?.()
  }

  /**
   * @internal
   */
  private M$getCompiledStyles(): string {
    return [...this.M$cache.values()].join('')
  }

}
