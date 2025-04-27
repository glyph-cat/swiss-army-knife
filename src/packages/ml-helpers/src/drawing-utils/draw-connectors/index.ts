import { Value2D } from '@glyph-cat/swiss-army-knife'

/**
 * @public
 */
export interface DrawConnectorOptions {
  /**
   * @defaultValue `'#ffffff'`
   */
  color?: string
  /**
   * @defaultValue `1`
   */
  lineWidth?: number
}

const defaultDrawConnectorOptions: Readonly<Required<DrawConnectorOptions>> = {
  color: '#ffffff',
  lineWidth: 1,
}

/**
 * @public
 */
export function drawConnectors(
  ctx: CanvasRenderingContext2D,
  landmarks: Array<Value2D>,
  connections: Array<[start: number, end: number]>,
  style?: DrawConnectorOptions
): void {
  const mergedStyle = { ...defaultDrawConnectorOptions, ...style }
  for (const connection of connections) {
    const [landmarkKeyA, landmarkKeyB] = connection
    const pointA = landmarks[landmarkKeyA]
    const pointB = landmarks[landmarkKeyB]
    ctx.beginPath()
    ctx.moveTo(pointA.x * ctx.canvas.width, pointA.y * ctx.canvas.height)
    ctx.lineTo(pointB.x * ctx.canvas.width, pointB.y * ctx.canvas.height)
    ctx.lineWidth = mergedStyle.lineWidth
    ctx.strokeStyle = mergedStyle.color
    ctx.stroke()
  }
}
