import { MAX_ALPHA } from '../constants'

/**
 * @public
 */
export interface BaseColorJson {
  /**
   * The alpha value (`0` to `1`).
   */
  a: number
}

/**
 * @public
 */
export abstract class BaseColorObject {

  readonly a: number

  constructor(a?: number) {
    this.a = a ?? MAX_ALPHA
  }

  abstract toString(): string

  abstract toJSON(): unknown

  abstract valueOf(): unknown

}
