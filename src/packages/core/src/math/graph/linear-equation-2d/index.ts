import { Value2D } from '../../abstractions'

/**
 * @public
 */
export class LinearEquation2D {

  /**
   * Calculates the mapped value 2D linear equation from a point and a gradient.
   * @example
   * const point = { x: 4, y: 5 }
   * const m = 1.5
   * const x = 42
   * const output = LinearEquation2D.calcFromPointAndGradient(point, m, x)
   * console.log(output) // 65
   */
  static calcFromPointAndGradient(point: Value2D, gradient: number, x: number): number {
    const c = point.y - gradient * point.x
    return gradient * x + c
  }

  /**
   * Calculates the mapped value 2D linear equation from two points.
   * @example
   * const pointA = { x: 4, y: 5 }
   * const pointB = { x: 6, y: 8 }
   * const x = 42
   * const output = LinearEquation2D.calcFromPoints(pointA, pointB, x)
   * console.log(output) // 65
   */
  static calcFromPoints(pointA: Value2D, pointB: Value2D, x: number): number {
    const m = (pointB.y - pointA.y) / (pointB.x - pointA.x)
    const c = pointA.y - m * pointA.x
    return m * x + c
  }

  /**
   * Creates a {@link LinearEquation2D | 2D linear equation} from a point and a gradient.
   * @example
   * const point = { x: 4, y: 5 }
   * const m = 1.5
   * const equation = LinearEquation2D.fromPointAndGradient(point, m)
   */
  static fromPointAndGradient(point: Value2D, gradient: number): LinearEquation2D {
    const c = point.y - gradient * point.x
    return new LinearEquation2D(gradient, c)
  }

  /**
   * Creates a {@link LinearEquation2D | 2D linear equation} from two points.
   * @example
   * const pointA = { x: 4, y: 5 }
   * const pointB = { x: 6, y: 8 }
   * const equation = LinearEquation2D.fromPoints(pointA, pointB)
   */
  static fromPoints(pointA: Value2D, pointB: Value2D): LinearEquation2D {
    const m = (pointB.y - pointA.y) / (pointB.x - pointA.x)
    const c = pointA.y - m * pointA.x
    return new LinearEquation2D(m, c)
  }

  constructor(
    /**
     * Gradient of the equation.
     */
    readonly m: number,
    /**
     * Constant of the equation.
     */
    readonly c: number,
  ) {
    this.calc = this.calc.bind(this)
    this.ƒ = this.ƒ.bind(this)
  }

  /**
   * Calculates `y` value, given `x`.
   * @example
   * const point = { x: 4, y: 5 }
   * const m = 1.5
   * const equation = LinearEquation2D.fromPointAndGradient(point, m)
   * const output = equation.calc(42)
   * console.log(output) // 65
   */
  calc(x: number): number {
    return this.m * x + this.c
  }

  /**
   * An alias for {@link calc | `calc`}.
   * @example
   * const point = { x: 4, y: 5 }
   * const m = 1.5
   * const equation = LinearEquation2D.fromPointAndGradient(point, m)
   * const output = equation.ƒ(42)
   * console.log(output) // 65
   */
  ƒ(x: number): number {
    return this.m * x + this.c
  }

}
