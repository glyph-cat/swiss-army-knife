import { Charset } from '@glyph-cat/foundation'
import { pickRandom } from '../../random'
import { BaseHashFactory } from '../base'

const prefixCharset = Charset.ALPHABET_LOWER
const bodyCharset = Charset.DEFAULT

/**
 * @public
 */
export class CSSClassNameFactory extends BaseHashFactory<[number]> {

  /**
   * Generates a random CSS class name which uniqueness is not guaranteed.
   */
  static create(length: number): string {
    let hash = pickRandom(prefixCharset)
    while (hash.length < length) {
      hash += pickRandom(bodyCharset)
    }
    return hash
  }

  /**
   * A hash factory that generates random hashes while guaranteeing uniqueness.
   * If collision occurs above a set threshold, the hash length will be
   * increased automatically.
   * @param minimumLength - The minimum length of the hash.
   * @param bumpThreshold - When value is `1`, each time the number of
   * _**non-unique**_ collisions reach the maximum number of combinations
   * based on the character set and minimum length, the minimum length of the
   * generated hash will be increased by `1`. A lower value will allow the
   * minimum length to be increased before all possible combinations are exhausted,
   * therefore reducing retry attempts and minimizing computing resources.
   * The default value is `0.8`.
   */
  constructor(public minimumLength: number, readonly bumpThreshold: number = 0.8) {
    super((collisionCount: number, scopedLength: number) => {
      const possibleCombinationCount = Math.pow(bodyCharset.length, scopedLength)
      const shouldBump = collisionCount / possibleCombinationCount >= bumpThreshold
      return CSSClassNameFactory.create(scopedLength + (shouldBump ? Math.ceil(collisionCount / possibleCombinationCount) : 0))
    })
    this.minimumLength = Math.max(0, minimumLength)
  }

  /**
   * Generates a random CSS class name which uniqueness is guaranteed within
   * the scope of this hash factory instance.
   */
  create(overwriteMinimumLength?: number): string {
    return super.create(overwriteMinimumLength || this.minimumLength)
  }

}

/**
 * @public
 */
export const GlobalCSSClassNameFactory = new CSSClassNameFactory(6)
