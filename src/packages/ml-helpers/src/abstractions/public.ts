import {
  FaceLandmarker,
  FilesetResolver,
  HandLandmarker,
  PoseLandmarker,
} from '@mediapipe/tasks-vision'

/**
 * "Module '"@mediapipe/tasks-vision"' declares 'WasmFileset' locally, but it is not exported."
 * BRUH... zzz
 * @public
 */
export type WasmFileset = Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>

/**
 * @public
 */
export type VisionLandmarker = FaceLandmarker | HandLandmarker | PoseLandmarker

/**
 * @public
 */
export enum VisionAnalyzerState {
  CREATED,
  INITIALIZING,
  STANDBY,
  ACTIVE,
  DISPOSED,
}
