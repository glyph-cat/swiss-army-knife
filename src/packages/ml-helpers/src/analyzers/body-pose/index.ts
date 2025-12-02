import { reflect1D } from '@glyph-cat/swiss-army-knife'
import {
  NormalizedLandmark,
  PoseLandmarker,
  PoseLandmarkerOptions,
  PoseLandmarkerResult,
} from '@mediapipe/tasks-vision'
import { BaseLandmarkAnalyzer, LandmarkAnalyzerOptions } from '../base-classes'

/**
 * @public
 */
export type OnePersonBodyPoseAnalyzerResult = Array<NormalizedLandmark>

/**
 * @public
 */
export class OnePersonBodyPoseAnalyzer extends BaseLandmarkAnalyzer<PoseLandmarker, OnePersonBodyPoseAnalyzerResult> {

  // {
  //   baseOptions: {
  //     modelAssetPath: '/mediapipe/models/pose_landmarker_lite.task',
  //     delegate: 'GPU',
  //   },
  //   runningMode: 'VIDEO',
  // }

  // TODO: implement from base class????
  private static readonly M$cache: Record<string, Promise<PoseLandmarker>> = {}

  constructor(
    videoElement: HTMLVideoElement,
    poseLandmarkerOptions: Omit<PoseLandmarkerOptions, 'numPoses'>,
    private readonly options?: LandmarkAnalyzerOptions,
  ) {
    super(videoElement, new Array(Object.keys(BodyPoseLandmark).length / 2).fill({
      x: 0,
      y: 0,
      z: 0,
      visibility: 0,
    }), async () => {
      const optionsKey = JSON.stringify(poseLandmarkerOptions)
      if (!OnePersonBodyPoseAnalyzer.M$cache[optionsKey]) {
        OnePersonBodyPoseAnalyzer.M$cache[optionsKey] = PoseLandmarker.createFromOptions(
          await BaseLandmarkAnalyzer.getVision(),
          {
            ...poseLandmarkerOptions,
            numPoses: 1,
          }
        )
      }
      return OnePersonBodyPoseAnalyzer.M$cache[optionsKey]
    }, 'OnePersonBodyPoseAnalyzer', options)
  }

  protected getProcessedResult(rawResult: PoseLandmarkerResult): OnePersonBodyPoseAnalyzerResult {
    const processedLandmarks: OnePersonBodyPoseAnalyzerResult = []
    if (rawResult.landmarks.length <= 0) { return }
    const landmarks = rawResult.landmarks[0]
    const flipHorizontally = this.options?.flipHorizontally
    for (const landmark of landmarks) {
      processedLandmarks.push({
        ...landmark,
        // These values range between 0 to 1
        x: flipHorizontally ? reflect1D(landmark.x, 0.5) : landmark.x,
        visibility: 1,
      })
    }
    return processedLandmarks
  }

}

/**
 * @public
 */
export enum BodyPoseLandmark {
  NOSE,
  LEFT_EYE_INNER,
  LEFT_EYE,
  LEFT_EYE_OUTER,
  RIGHT_EYE_INNER,
  RIGHT_EYE,
  RIGHT_EYE_OUTER,
  LEFT_EAR,
  RIGHT_EAR,
  MOUTH_LEFT,
  MOUTH_RIGHT,
  LEFT_SHOULDER,
  RIGHT_SHOULDER,
  LEFT_ELBOW,
  RIGHT_ELBOW,
  LEFT_WRIST,
  RIGHT_WRIST,
  LEFT_PINKY,
  RIGHT_PINKY,
  LEFT_INDEX,
  RIGHT_INDEX,
  LEFT_THUMB,
  RIGHT_THUMB,
  LEFT_HIP,
  RIGHT_HIP,
  LEFT_KNEE,
  RIGHT_KNEE,
  LEFT_ANKLE,
  RIGHT_ANKLE,
  LEFT_HEEL,
  RIGHT_HEEL,
  LEFT_FOOT_INDEX,
  RIGHT_FOOT_INDEX,
}
