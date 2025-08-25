import { isBoolean, Nullable } from '@glyph-cat/swiss-army-knife'
import { ComponentType, createElement, Suspense } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export class PreloadableComponent<P = {}> {

  /**
   * @internal
   */
  private _isSuccessful: Nullable<boolean> = null

  constructor(readonly component: ComponentType<P>) {
    this.preload = this.preload.bind(this)
  }

  /**
   * @returns `true` if the preloading was successful, otherwise `false`.
   */
  preload(): boolean {
    if (isBoolean(this._isSuccessful)) {
      return this._isSuccessful // Early exit
    }
    try {
      renderToStaticMarkup(createElement(Suspense, {}, createElement(this.component)))
      this._isSuccessful = true
    } catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars
      this._isSuccessful = false
    }
    return this._isSuccessful
  }

}
