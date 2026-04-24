import { Charset } from '@glyph-cat/foundation'
import { BaseHashFactory } from '../base'
import { HashFactory } from '../generic'

/**
 * @public
 */
export class UUIDFactory extends BaseHashFactory {

  /**
   * Generates a UUID. Uniqueness is not completely guaranteed.
   */
  static create(): string {
    return [
      HashFactory.create(8, Charset.HEX_LOWER),
      HashFactory.create(4, Charset.HEX_LOWER),
      HashFactory.create(4, Charset.HEX_LOWER),
      HashFactory.create(4, Charset.HEX_LOWER),
      HashFactory.create(12, Charset.HEX_LOWER),
    ].join('-')
  }

  constructor() {
    super(UUIDFactory.create)
  }

  /**
   * Generates a UUID which uniqueness is guaranteed within the scope of this
   * hash factory instance.
   */
  create(): string {
    return super.create()
  }

}
