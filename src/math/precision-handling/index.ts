import { IS_CLIENT_ENV } from '../../constants'
import { devWarn } from '../../dev'

/**
 * @example
 * const { add, subtract, multiply, divide } = new MathFactory(2)
 * add(0.1, 0.2) // will return 0.3 instead of 0.30000000000000004
 * subtract(0.3, 0.1) // will return 0.2 instead of 0.19999999999999998
 * multiply(0.1, 0.1) // will return 0.01 instead of 0.010000000000000002
 * divide(0.3, 0.2) // will return 1.5 instead of 1.4999999999999998
 * @public
 */
export class MathFactory {

  /**
   * @internal
   */
  private readonly offset: number

  constructor(public readonly decimals: number) {
    if (IS_CLIENT_ENV) {
      if (decimals < 0) {
        devWarn(`Expected \`decimal\` to be >=1 but got ${decimals}`)
      } else if (decimals === 0) {
        devWarn(`${MathFactory.name} is unnecessary when decimals is 0`)
      }
    }
    this.decimals = Math.max(decimals, 0)
    this.offset = Math.pow(10, this.decimals)
  }

  /**
   * @example
   * add(0.1, 0.2) // will return 0.3 instead of 0.30000000000000004
   */
  add(value1: number, value2: number, ...valuesN: Array<number>): number

  /**
   * @internal
   */
  add(value1: number, ...valuesN: Array<number>): number {
    const offset = Math.pow(10, this.decimals)
    let result = value1 * offset
    for (const value of valuesN) {
      result += value * offset
    }
    return parseFloat((result / offset).toFixed(this.decimals))
  }

  /**
   * @example
   * subtract(0.3, 0.1) // will return 0.2 instead of 0.19999999999999998
   */
  subtract(value1: number, value2: number, ...valuesN: Array<number>): number

  /**
   * @internal
   */
  subtract(value1: number, ...valuesN: Array<number>): number {
    const offset = Math.pow(10, this.decimals)
    let result = value1 * offset
    for (const value of valuesN) {
      result -= value * offset
    }
    return parseFloat((result / offset).toFixed(this.decimals))
  }

  /**
   * @example
   * multiply(0.1, 0.1) // will return 0.01 instead of 0.010000000000000002
   */
  multiply(value1: number, value2: number, ...valuesN: Array<number>): number

  /**
   * @internal
   */
  multiply(value1: number, ...valueN: Array<number>): number {
    // NOTE: Multiplication by offset before the loop and dividing it after the loop
    // may seem redundant, but is actually part of the prevention measure to counter
    // loss of precision.
    let result = value1 * this.offset
    for (const nextValue of valueN) {
      // IMPORTANT: Order or multiplication and division matters here
      result *= nextValue * this.offset
      result /= this.offset
    }
    return parseFloat((result / this.offset).toFixed(this.decimals))
  }

  /**
   * @example
   * divide(0.3, 0.2) // will return 1.5 instead of 1.4999999999999998
   */
  divide(value1: number, value2: number, ...valuesN: Array<number>): number

  /**
   * @internal
   */
  divide(value1: number, ...valuesN: Array<number>): number {
    // NOTE: No need to (multiply|divide) by offset (before|after) the loop
    // because the offset can be multiplied in side the loop and it will get
    // cancelled out after each division.
    let result = value1
    for (const nextValue of valuesN) {
      // IMPORTANT: Order or multiplication and division matters here
      result = (result * this.offset) / (nextValue * this.offset)
    }
    return parseFloat(result.toFixed(this.decimals))
  }

}
