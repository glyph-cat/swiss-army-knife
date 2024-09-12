import { pickRandom } from '../../random'
import { BaseHashFactory } from '../base'
import { Charset } from '../charset'

/**
 * @public
 */
export class HashFactory extends BaseHashFactory {

  /**
   * Generates a random hash which uniqueness is not guaranteed.
   */
  static create(
    length: number,
    /**
     * @defaultValue `Charset.DEFAULT`
     */
    charset: string = Charset.DEFAULT,
  ): string {
    let hash = ''
    while (hash.length < length) {
      hash += pickRandom(charset)
    }
    return hash
  }

  /**
   * A hash factory that generates random hashes while guaranteeing uniqueness.
   * If collision occurs above a set threshold, the hash length will be
   * increased automatically.
   * @param minimumLength - The minimum length of the hash.
   * @param charset - The character set of the hash. Defaults to {@link Charset.DEFAULT}.
   * @param bumpThreshold - When value is `1`, each time the number of collisions
   * reach the maximum number of combinations based on the character set and
   * minimum length, the minimum length of the generated hash will be increased
   * by `1`. A lower value will allow the minimum length to be increased before
   * all possible combinations are exhausted, therefore reducing retry attempts
   * and minimizing computing resources. The default value is `0.8`.
   */
  constructor(
    public minimumLength: number,
    public charset?: string,
    readonly bumpThreshold: number = 0.8,
  ) {
    super((collisionCount: number, scopedLength: number, scopedCharset: string) => {
      const possibleCombinationCount = Math.pow(scopedCharset.length, scopedLength)
      const shouldBump = collisionCount / possibleCombinationCount >= bumpThreshold
      return HashFactory.create(
        scopedLength + (shouldBump ? Math.ceil(collisionCount / possibleCombinationCount) : 0),
        scopedCharset
      )
    })
    this.charset = charset || Charset.DEFAULT
    this.minimumLength = Math.max(0, minimumLength)
  }

  /**
   * Generates a random hash which uniqueness is guaranteed within the scope of
   * this hash factory instance.
   */
  create(overwriteMinimumLength?: number, overwriteCharset?: string): string {
    return super.create(
      overwriteMinimumLength || this.minimumLength,
      overwriteCharset || this.charset,
    )
  }

}
