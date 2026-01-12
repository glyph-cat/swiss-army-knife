import { Nullable } from '@glyph-cat/foundation'
import { isBoolean } from '@glyph-cat/type-checking'
import { ComponentType, createElement } from 'react'
import { renderToString } from 'react-dom/server'

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export class PreloadableComponent<P = {}> {

  /**
   * @internal
   */
  private M$isSuccessful: Nullable<boolean> = null

  constructor(readonly component: ComponentType<P>) {
    this.preload = this.preload.bind(this)
  }

  /**
   * @returns `true` if the preloading was successful, otherwise `false`.
   */
  preload(): boolean {
    if (isBoolean(this.M$isSuccessful)) {
      return this.M$isSuccessful // Early exit
    }
    try {
      // No error boundaries were necessary as they would serialize into string
      // and not get thrown or cause annoying pop-ups in the dev environment
      // as we would get when using `createRoot` to achieve the equivalent.
      renderToString(createElement(this.component))
      this.M$isSuccessful = true
    } catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars
      this.M$isSuccessful = false
    }
    return this.M$isSuccessful
  }

}
