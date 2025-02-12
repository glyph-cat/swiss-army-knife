import { createRef } from '../../data'
import { CleanupFunction, IDisposable } from '../../types'
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

  readonly styleElement: HTMLStyleElement

  readonly removeStyles: CleanupFunction

  constructor(
    initialStyles?: Iterable<readonly [string, ExtendedCSSProperties]>,
    readonly precedenceLevel?: PrecedenceLevel
  ) {
    super(initialStyles)
    const styleElementRef = createRef<HTMLStyleElement>(null)
    this.forEach((value, key) => {
      this.M$cache.set(key, compileStyle(key, value))
    })
    this.removeStyles = addStyles(this.M$getCompiledStyles(), precedenceLevel, styleElementRef)
    this.styleElement = styleElementRef.current
  }

  set(key: string, value: ExtendedCSSProperties): this {
    super.set(key, value)
    this.M$cache.set(key, compileStyle(key, value))
    this.styleElement.innerHTML = this.M$getCompiledStyles()
    return this
  }

  delete(key: string): boolean {
    const payload = super.delete(key)
    this.M$cache.delete(key)
    this.styleElement.innerHTML = this.M$getCompiledStyles()
    return payload
  }

  clear(): void {
    super.clear()
    this.M$cache.clear()
    this.styleElement.innerHTML = ''
  }

  dispose(): void {
    this.clear()
    this.M$cache.clear()
    this.styleElement.remove()
  }

  /**
   * @internal
   */
  private M$getCompiledStyles(): string {
    return this.M$cache.values().toArray().join('')
  }

}
