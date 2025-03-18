/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @public
 */
export namespace Empty {

  /**
   * @public
   */
  export const ARRAY: Readonly<Array<any>> = []

  /**
   * @public
   */
  export const FUNCTION = (): void => { /* nothing to do here */ }

  /**
   * @public
   */
  export const OBJECT: Readonly<Record<PropertyKey, any>> = {}

  /**
   * @public
   */
  export const STRING = ''

}
