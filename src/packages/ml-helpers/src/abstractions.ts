import {
  FaceLandmarker,
  FilesetResolver,
  HandLandmarker,
  PoseLandmarker,
} from '@mediapipe/tasks-vision'

/**
 * "Module '"@mediapipe/tasks-vision"' declares 'WasmFileset' locally, but it is not exported."
 * BRUH... zzz
 */
export type WasmFileset = Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>

export type VisionLandmarker = FaceLandmarker | HandLandmarker | PoseLandmarker
