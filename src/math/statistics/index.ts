import { isUndefined } from '../../data'

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
  private M$stddev: number

  readonly values: Array<number>

  constructor(...values: Array<number>) {
    this.values = values
  }

  get sum(): number {
    if (isUndefined(this.M$sum)) {
      this.M$sum = 0
      for (let i = 0; i < this.values.length; i++) {
        this.M$sum += this.values[i]
      }
    }
    return this.M$sum
  }

  get mean(): number {
    if (isUndefined(this.M$mean)) {
      this.M$mean = this.sum / this.values.length
    }
    return this.M$mean
  }

  get median(): number {
    if (isUndefined(this.M$median)) {
      // todo
      // this.M$median =
    }
    return this.M$median
  }

  get stddev(): number {
    if (isUndefined(this.M$stddev)) {
      // todo
      // this.M$stddev =
    }
    return this.M$stddev
  }

}
