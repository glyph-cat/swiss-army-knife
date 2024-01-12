import { getRandomHash } from '../random/hash'

const UNIQUE_RUNTIME_ID = getRandomHash(12)

/**
 * Base class for custom data types provided in this library.
 * @public
 */
export class GCObject {

  /**
   * @internal
   */
  private static M$idCounter = 0

  /**
   * A sort of unique signature that is created during instantiation of object
   * at runtime. Mainly used for debugging.
   */
  readonly $id: number

  /**
   * A sort of unique signature that is created during initialization of the
   * project. Can be used to debug and identify anomalies when objects are
   * instatiated in [unexpected stray processes](https://github.com/vercel/next.js/issues/34308)
   * or in React Native worklets.
   */
  readonly $runtimeId: string = UNIQUE_RUNTIME_ID

  /**
   * @example
   * class Something extends GCObject {
   *   // ...
   * }
   */
  constructor() {
    // Reference: https://stackoverflow.com/a/29244254/5810737
    this.$id = ++(this.constructor as typeof GCObject).M$idCounter
  }

}
