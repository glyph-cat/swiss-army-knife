/**
 * @internal
 */
let idCounter = 0

/**
 * Base class for custom data types provided in this library.
 * @public
 */
export class GCObject {

  /**
   * A sort of unique signature that is created during instantiation of object
   * at runtime. Mainly used for debugging.
   */
  $id: number

  /**
   * @example
   * class Something extends GCObject {
   *   // ...
   * }
   */
  constructor() {
    this.$id = ++idCounter
  }

}
