import { IS_INTERNAL_DEBUG_ENV } from '../../constants'
import { isUndefined } from '../../data'
import { spyFn } from './test-utils'

/**
 * @public
 */
export interface NumericDataSetOptions {
  /**
   * @defaultValue `false`
   */
  forPopulation?: boolean
}

/**
 * @public
 */
export class NumericDataSet {

  /**
   * @internal
   */
  private M$sum: number

  /**
   * @internal
   */
  private M$mean: number

  /**
   * @internal
   */
  private M$median: number

  /**
   * @internal
   */
  private M$variance: number

  /**
   * @internal
   */
  private M$stddev: number

  readonly values: Readonly<Array<number>>
  readonly options: Readonly<NumericDataSetOptions>

  constructor(values: Array<number>, options?: NumericDataSetOptions) {
    this.values = values
    this.options = { ...options }
  }

  get size(): number {
    return this.values.length
  }

  get sum(): number {
    if (isUndefined(this.M$sum)) {
      if (IS_INTERNAL_DEBUG_ENV) { spyFn.current?.('sum') }
      this.M$sum = 0
      for (let i = 0; i < this.values.length; i++) {
        this.M$sum += this.values[i]
      }
    }
    return this.M$sum
  }

  get mean(): number {
    if (isUndefined(this.M$mean)) {
      if (IS_INTERNAL_DEBUG_ENV) { spyFn.current?.('mean') }
      this.M$mean = this.sum / this.values.length
    }
    return this.M$mean
  }

  /**
   * # · Important Note ·
   * Data needs to be _**sorted**_ already before they are passed to the
   * constructor of `NumericDataSet`.
   */
  get median(): number {
    if (isUndefined(this.M$median)) {
      if (IS_INTERNAL_DEBUG_ENV) { spyFn.current?.('median') }
      if (this.values.length % 2 !== 0) {
        this.M$median = this.values[Math.ceil(this.values.length / 2)]
      } else {
        const halfLength = this.values.length / 2
        this.M$median = (this.values[halfLength] + this.values[halfLength + 1]) / 2
      }
    }
    return this.M$median
  }

  get variance(): number {
    if (isUndefined(this.M$variance)) {
      if (IS_INTERNAL_DEBUG_ENV) { spyFn.current?.('variance') }
      let differenceOfSumAndMeanSquared = 0
      for (let i = 0; i < this.values.length; i++) {
        differenceOfSumAndMeanSquared += Math.pow(this.values[i] - this.mean, 2)
      }
      this.M$variance = differenceOfSumAndMeanSquared / (
        this.values.length - (this.options.forPopulation ? 0 : 1)
      )
    }
    return this.M$variance
  }

  get stddev(): number {
    if (isUndefined(this.M$stddev)) {
      if (IS_INTERNAL_DEBUG_ENV) { spyFn.current?.('stddev') }
      this.M$stddev = Math.sqrt(this.variance)
    }
    return this.M$stddev
  }

}
