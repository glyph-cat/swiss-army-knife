import { Value2D } from '@glyph-cat/foundation'

/**
 * @public
 */
export interface DrawLandmarkOptions {
  /**
   * @defaultValue `'#ffffff'`
   */
  color?: string
  /**
   * @defaultValue `3`
   */
  radius?: number
}

const defaultDrawLandmarkOptions: Readonly<Required<DrawLandmarkOptions>> = {
  color: '#ffffff',
  radius: 3,
}

/**
 * @public
 */
export function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: Array<Value2D>,
  style?: DrawLandmarkOptions
): void {
  const mergedStyle = { ...defaultDrawLandmarkOptions, ...style }
  for (const landmark of landmarks) {
    const { x, y } = landmark
    ctx.beginPath()
    ctx.arc(x * ctx.canvas.width, y * ctx.canvas.height, mergedStyle.radius, 0, 2 * Math.PI)
    ctx.fillStyle = mergedStyle.color
    ctx.fill()
  }
}
