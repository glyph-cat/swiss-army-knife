import { LazyValue, reflect1D } from '@glyph-cat/swiss-army-knife'
import { HandLandmarker, HandLandmarkerResult, NormalizedLandmark } from '@mediapipe/tasks-vision'
import { BaseLandmarkAnalyzer } from '../base-classes'
import { BodyPoseLandmark, OnePersonBodyPoseAnalyzer } from '../body-pose'
import { getHandedness } from './utils'

/**
 * @public
 */
export type OnePersonHandPoseAnalyzerHandResult = Array<NormalizedLandmark>

/**
 * @public
 */
export interface OnePersonHandPoseAnalyzerResult {
  L?: OnePersonHandPoseAnalyzerHandResult
  R?: OnePersonHandPoseAnalyzerHandResult
}

/**
 * @public
 */
export class OnePersonHandPoseAnalyzer extends BaseLandmarkAnalyzer<HandLandmarker, OnePersonHandPoseAnalyzerResult> {

  /**
   * @internal
   */
  private static M$taskRunnerGetter = new LazyValue(async () => {
    return HandLandmarker.createFromOptions(
      await BaseLandmarkAnalyzer.getVision(),
      {
        baseOptions: {
          modelAssetPath: '/mediapipe/models/hand_landmarker.task',
          delegate: 'GPU',
        },
        numHands: 2,
        runningMode: 'VIDEO',
      }
    )
  })

  constructor(private readonly bodyPoseAnalyzer: OnePersonBodyPoseAnalyzer) {
    super(
      bodyPoseAnalyzer.videoElement,
      {},
      OnePersonHandPoseAnalyzer.M$taskRunnerGetter,
      'OnePersonHandPoseAnalyzer',
    )
  }

  protected getProcessedResult(rawResult: HandLandmarkerResult): OnePersonHandPoseAnalyzerResult {
    const bodyPoseResult = this.bodyPoseAnalyzer.result.get()
    const processedLandmarks: OnePersonHandPoseAnalyzerResult = {}
    for (const landmarks of rawResult.landmarks) {
      const subLandmark: Array<NormalizedLandmark> = []
      let wrist: NormalizedLandmark
      for (let i = 0; i < landmarks.length; i++) {
        const landmark = landmarks[i]
        const flippedLandmark = {
          ...landmark,
          x: reflect1D(landmark.x, 0.5),
          visibility: 1,
        }
        if (i === HandPoseLandmark.WRIST) {
          wrist = flippedLandmark
        }
        subLandmark.push(flippedLandmark)
      }
      const handedness = getHandedness(
        wrist,
        bodyPoseResult[BodyPoseLandmark.LEFT_WRIST],
        bodyPoseResult[BodyPoseLandmark.RIGHT_WRIST],
      )
      processedLandmarks[handedness] = subLandmark
    }
    return processedLandmarks
  }

}

/**
 * @public
 */
export enum HandPoseLandmark {
  WRIST,
  THUMB_CMC,
  THUMB_MCP,
  THUMB_IP,
  THUMB_TIP,
  INDEX_FINGER_MCP,
  INDEX_FINGER_PIP,
  INDEX_FINGER_DIP,
  INDEX_FINGER_TIP,
  MIDDLE_FINGER_MCP,
  MIDDLE_FINGER_PIP,
  MIDDLE_FINGER_DIP,
  MIDDLE_FINGER_TIP,
  RING_FINGER_MCP,
  RING_FINGER_PIP,
  RING_FINGER_DIP,
  RING_FINGER_TIP,
  PINKY_FINGER_MCP,
  PINKY_FINGER_PIP,
  PINKY_FINGER_DIP,
  PINKY_FINGER_TIP,
}
