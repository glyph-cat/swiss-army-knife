/**
 * @public
 */
export namespace Empty {

  /**
   * @public
   */
  export const ARRAY: Readonly<Array<unknown>> = []

  /**
   * @public
   */
  export const FUNCTION = (): void => { /* nothing to do here */ }

  /**
   * @public
   */
  export const OBJECT: Readonly<Record<PropertyKey, unknown>> = {}

  /**
   * @public
   */
  export const STRING = ''

}
