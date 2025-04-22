/**
 * @public
 */
export interface Value2D {
  x: number
  y: number
}

/**
 * @public
 */
export interface Value3D extends Value2D {
  z: number
}

/**
 * @public
 */
export type Tuple2D = [x: number, y: number]

/**
 * @public
 */
export type Tuple3D = [x: number, y: number, z: number]
