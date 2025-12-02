import { reflect1D } from '@glyph-cat/swiss-army-knife'
import {
  GestureRecognizer,
  GestureRecognizerOptions,
  GestureRecognizerResult,
  NormalizedLandmark,
} from '@mediapipe/tasks-vision'
import { BaseVisionAnalyzer, DetectionMethod, LandmarkAnalyzerOptions } from '../base-classes'
import { BodyPoseLandmark, OnePersonBodyPoseAnalyzer } from '../body-pose'
import { HandPoseLandmark } from '../hand-pose'
import { getHandedness } from '../hand-pose/utils'

/**
 * @public
 */
export type OnePersonHandGestureAnalyzerHandResult = [
  gesture: HandGesture,
  landmarks: Array<NormalizedLandmark>,
]

/**
 * @public
 */
export interface OnePersonHandGestureAnalyzerResult {
  L?: OnePersonHandGestureAnalyzerHandResult
  R?: OnePersonHandGestureAnalyzerHandResult
}

/**
 * @public
 */
export class OnePersonHandGestureAnalyzer extends BaseVisionAnalyzer<GestureRecognizer, OnePersonHandGestureAnalyzerResult> {

  // baseOptions: {
  //   modelAssetPath: '/mediapipe/models/gesture_recognizer.task',
  //   delegate: 'GPU',
  // },
  // runningMode: 'VIDEO',

  // TODO: implement from base class????
  private static readonly M$cache: Record<string, Promise<GestureRecognizer>> = {}

  constructor(
    private readonly bodyPoseAnalyzer: OnePersonBodyPoseAnalyzer,
    gestureRecognizerOptions: Omit<GestureRecognizerOptions, 'numHands'>,
    options?: LandmarkAnalyzerOptions,
  ) {
    super(bodyPoseAnalyzer.videoElement, {}, async () => {
      const optionsKey = JSON.stringify(gestureRecognizerOptions)
      if (!OnePersonHandGestureAnalyzer.M$cache[optionsKey]) {
        OnePersonHandGestureAnalyzer.M$cache[optionsKey] = GestureRecognizer.createFromOptions(
          await BaseVisionAnalyzer.getVision(),
          {
            ...gestureRecognizerOptions,
            numHands: 2,
          }
        )
        return OnePersonHandGestureAnalyzer.M$cache[optionsKey]
      }
    }, DetectionMethod.recognizeForVideo, 'OnePersonHandGestureAnalyzer', options)
  }

  protected getProcessedResult(rawResult: GestureRecognizerResult): OnePersonHandGestureAnalyzerResult {
    const bodyPoseResult = this.bodyPoseAnalyzer.result.get()
    const processedResults: OnePersonHandGestureAnalyzerResult = {}
    for (const landmarksIndex in rawResult.landmarks) {
      const landmarks = rawResult.landmarks[landmarksIndex]
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
      processedResults[handedness] = [
        rawResult.gestures[landmarksIndex][0].categoryName as HandGesture ?? HandGesture.NONE,
        subLandmark,
      ]
    }
    return processedResults
  }

}

/**
 * @public
 */
export enum HandGesture {
  NONE = 'None',
  CLOSED_FIST = 'Closed_Fist',
  OPEN_PALM = 'Open_Palm',
  POINTING_UP = 'Pointing_Up',
  THUMB_DOWN = 'Thumb_Down',
  THUMB_UP = 'Thumb_Up',
  VICTORY = 'Victory',
  I_LOVE_YOU = 'ILoveYou',
}
