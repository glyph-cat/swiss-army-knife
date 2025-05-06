import {
  drawConnectors,
  drawLandmarks,
  HAND_CONNECTIONS,
  OnePersonBodyPoseAnalyzer,
  OnePersonHandGestureAnalyzer,
  OnePersonHandGestureAnalyzerHandResult,
  OnePersonHandPoseAnalyzer,
} from '@glyph-cat/ml-helpers'
import { clamp, Dimension2D, getWindowDimensions, VideoCamera } from '@glyph-cat/swiss-army-knife'
import { useWindowDimensions } from '@glyph-cat/swiss-army-knife-react'
import { NormalizedLandmark, PoseLandmarker } from '@mediapipe/tasks-vision'
import { CSSProperties, JSX, useLayoutEffect, useMemo, useRef } from 'react'

export const DUAL_MOTION_POINTER_COLOR = '#ff80ff'
export const LEFT_MOTION_POINTER_COLOR = '#ff2b80'
export const RIGHT_MOTION_POINTER_COLOR = '#2b80ff'

export enum CameraDisplayMode {
  MESH_ONLY,
  VIDEO_ONLY,
  ALL,
}

interface Connection {
  start: number
  end: number
}

function convertConnection(connections: Array<Connection>): Array<[start: number, end: number]> {
  const convertedConnections: Array<[start: number, end: number]> = []
  for (const connection of connections) {
    convertedConnections.push([connection.start, connection.end])
  }
  return convertedConnections
}

const POSE_CONNECTIONS = convertConnection(PoseLandmarker.POSE_CONNECTIONS)

const BODY_POINT_RADIUS = 2 // px
const HAND_POINT_RADIUS = 1 // px
const LINE_WIDTH = 1 // px
const LINE_COLOR = '#ffffff'

export interface CameraDisplayProps {
  displayMode: CameraDisplayMode
  videoCamera?: VideoCamera
  handPoseAnalyzer?: OnePersonHandPoseAnalyzer
  handGestureAnalyzer?: OnePersonHandGestureAnalyzer
  bodyPoseAnalyzer?: OnePersonBodyPoseAnalyzer
  className?: string
  style?: CSSProperties
}

export function CameraDisplay({
  displayMode,
  videoCamera,
  handPoseAnalyzer,
  handGestureAnalyzer,
  bodyPoseAnalyzer,
  className,
  style,
}: CameraDisplayProps): JSX.Element {

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasDimensions = useCanvasDimensions()

  useLayoutEffect(() => {

    let shouldRun = true
    let lastRequestedAnimationFrame: number

    const cb = () => {

      const canvasContext = canvasRef.current?.getContext('2d')
      if (canvasContext) {

        // NOTE: We do not need to call `clearRect` because the entire canvas
        // will be repainted, either with a new video frame or solid black
        // if no `videoCamera` is provided.

        if (videoCamera && (
          displayMode === CameraDisplayMode.ALL ||
          displayMode === CameraDisplayMode.VIDEO_ONLY
        )) {
          canvasContext.save()
          canvasContext.scale(-1, 1)
          canvasContext.translate(-canvasDimensions.width, 0)
          canvasContext.drawImage(
            videoCamera.videoElement,
            0, 0, canvasDimensions.width, canvasDimensions.height
          )
          canvasContext.restore()
        } else {
          canvasContext.fillStyle = '#000000'
          canvasContext.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height)
        }

        if (
          displayMode === CameraDisplayMode.ALL ||
          displayMode === CameraDisplayMode.MESH_ONLY
        ) {

          // #region Hand pose
          if (handGestureAnalyzer) {
            const landmarks = handGestureAnalyzer.result.get()
            canvasContext.save()
            for (const handedness in landmarks) {
              const [, landmark] = landmarks[handedness] as OnePersonHandGestureAnalyzerHandResult
              drawConnectors(canvasContext, landmark, HAND_CONNECTIONS, {
                lineWidth: LINE_WIDTH,
                color: LINE_COLOR,
              })
              drawLandmarks(canvasContext, landmark, {
                radius: HAND_POINT_RADIUS,
                color: handedness === 'L'
                  ? LEFT_MOTION_POINTER_COLOR
                  : RIGHT_MOTION_POINTER_COLOR,
              })
            }
            canvasContext.restore()
          } else if (handPoseAnalyzer) {
            const landmarks = handPoseAnalyzer.result.get()
            canvasContext.save()
            for (const handedness in landmarks) {
              const landmark = landmarks[handedness] as Array<NormalizedLandmark>
              drawConnectors(canvasContext, landmark, HAND_CONNECTIONS, {
                lineWidth: LINE_WIDTH,
                color: LINE_COLOR,
              })
              drawLandmarks(canvasContext, landmark, {
                radius: HAND_POINT_RADIUS,
                color: handedness === 'L'
                  ? LEFT_MOTION_POINTER_COLOR
                  : RIGHT_MOTION_POINTER_COLOR,
              })
            }
            canvasContext.restore()
          }
          // #endregion Hand pose

          // #region Body pose
          if (bodyPoseAnalyzer) {
            const landmark = bodyPoseAnalyzer.result.get()
            canvasContext.save()
            drawConnectors(canvasContext, landmark, POSE_CONNECTIONS, {
              lineWidth: LINE_WIDTH,
              color: LINE_COLOR,
            })
            drawLandmarks(canvasContext, landmark, {
              radius: BODY_POINT_RADIUS,
              color: '#2b80ff',
            })
            canvasContext.restore()
          }
          // #endregion Body pose

        }

      }

      if (shouldRun) { lastRequestedAnimationFrame = requestAnimationFrame(cb) }
    }
    lastRequestedAnimationFrame = requestAnimationFrame(cb)
    return () => {
      shouldRun = false
      cancelAnimationFrame(lastRequestedAnimationFrame)
    }

  }, [bodyPoseAnalyzer, canvasDimensions.height, canvasDimensions.width, displayMode, handPoseAnalyzer, videoCamera])

  return (
    <canvas
      className={className}
      ref={canvasRef}
      style={style}
      {...canvasDimensions}
    />
  )
}

export function getCanvasDimensions(): Dimension2D {
  const windowDimensions = getWindowDimensions()
  const vmin = Math.min(windowDimensions.height, windowDimensions.width)
  const width = clamp(Math.round(0.35 * vmin), 320, 600)
  const height = clamp(Math.round(width / 4 * 3), 240, 800)
  return { height, width }
}

/**
 * @returns The dimensions that should be used to display the player's camera.
 */
export function useCanvasDimensions(): Dimension2D {
  const windowDimensions = useWindowDimensions()
  const vmin = Math.min(windowDimensions.height, windowDimensions.width)
  return useMemo(() => {
    const width = clamp(Math.round(0.35 * vmin), 320, 600)
    const height = clamp(Math.round(width / 4 * 3), 240, 800)
    return { height, width }
  }, [vmin])
}
