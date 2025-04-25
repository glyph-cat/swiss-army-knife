import {
  degToRad,
  fullyEnumerate,
  getAngleFromPointsIn3D,
  NumericDataSet,
  PartialRecord,
} from '@glyph-cat/swiss-army-knife'
import { NormalizedLandmark } from '@mediapipe/hands'
import { HandPoseLandmark } from '../abstractions/public'

/**
 * @internal
 */
export enum Finger {
  THUMB = 'T',
  INDEX = 'I',
  MIDDLE = 'M',
  RING = 'R',
  PINKY = 'P',
}
fullyEnumerate(Finger)

/**
 * @internal
 */
export enum FingerCurl {
  ANY,
  NO,
  YES,
}

// TODO
// Need to take snapshots of hands curling
// Each finger may have a different threshold, for example the thumb

/**
 * @internal
 */
export class HandGesture {

  static getFingerCurlRawAngles(
    hand: Array<NormalizedLandmark>,
    finger: Finger
  ): Array<number> {
    const fingerConnection = FingerConnections[finger]
    const angles: Array<number> = []
    for (let i = 0; i < (fingerConnection.length - 2); i++) {
      const pointA = hand[fingerConnection[i]]
      const midPoint = hand[fingerConnection[i + 1]]
      const pointB = hand[fingerConnection[i + 2]]
      angles.push(getAngleFromPointsIn3D(midPoint, pointA, pointB))
    }
    return angles
  }

  static getFingerCurlAngle(
    hand: Array<NormalizedLandmark>,
    finger: Finger
  ): number {
    return new NumericDataSet(this.getFingerCurlRawAngles(hand, finger)).mean
  }

  static determineFingerCurl(
    hand: Array<NormalizedLandmark>,
    finger: Finger
  ): FingerCurl.NO | FingerCurl.YES {
    const averageAngle = this.getFingerCurlAngle(hand, finger)
    if (averageAngle > NOT_CURLED_THRESHOLD) {
      return FingerCurl.NO
    } else {
      return FingerCurl.YES
    }
    // } else if (averageAngle < CURL_THRESHOLD) {
    //   return FingerCurl.YES
    // } else {
    //   return FingerCurl.HALF
    // }
  }

  constructor(private readonly fingerCurlStates: PartialRecord<Finger, FingerCurl>) { }

  isFulfilledBy(hand: Array<NormalizedLandmark>): boolean {
    for (const curlState in this.fingerCurlStates) {
      if (this.fingerCurlStates[curlState] === FingerCurl.ANY) { continue }
      const fingerState = HandGesture.determineFingerCurl(hand, curlState as Finger)
      if (fingerState !== this.fingerCurlStates[curlState]) {
        return false // Early exit
      }
    }
    return true
  }

}

const NOT_CURLED_THRESHOLD = 3.0 // rad
// const CURL_THRESHOLD = 2.0 // rad

const FingerConnections = {
  [Finger.THUMB]: [
    // NOTE: CMC is excluded because the angle of CMC-MCP does not change much.
    HandPoseLandmark.THUMB_MCP,
    HandPoseLandmark.THUMB_IP,
    HandPoseLandmark.THUMB_TIP,
  ],
  [Finger.INDEX]: [
    // HandPoseLandmark.INDEX_FINGER_MCP,
    HandPoseLandmark.INDEX_FINGER_PIP,
    HandPoseLandmark.INDEX_FINGER_DIP,
    HandPoseLandmark.INDEX_FINGER_TIP,
  ],
  [Finger.MIDDLE]: [
    // HandPoseLandmark.MIDDLE_FINGER_MCP,
    HandPoseLandmark.MIDDLE_FINGER_PIP,
    HandPoseLandmark.MIDDLE_FINGER_DIP,
    HandPoseLandmark.MIDDLE_FINGER_TIP,
  ],
  [Finger.RING]: [
    // HandPoseLandmark.RING_FINGER_MCP,
    HandPoseLandmark.RING_FINGER_PIP,
    HandPoseLandmark.RING_FINGER_DIP,
    HandPoseLandmark.RING_FINGER_TIP,
  ],
  [Finger.PINKY]: [
    // HandPoseLandmark.PINKY_FINGER_MCP,
    HandPoseLandmark.PINKY_FINGER_PIP,
    HandPoseLandmark.PINKY_FINGER_DIP,
    HandPoseLandmark.PINKY_FINGER_TIP,
  ],
} as const

// const ResolverFingerStateDictionary: Readonly<Record<Finger, [
//   notCurledThreshold: number,
//   fullyCurledThreshold: number,
// ]>> = {
//   [Finger.THUMB]: [degToRad(180), degToRad(120)],
//   [Finger.INDEX]: [degToRad(180), degToRad(120)],
//   [Finger.MIDDLE]: [degToRad(180), degToRad(120)],
//   [Finger.RING]: [degToRad(180), degToRad(120)],
//   [Finger.PINKY]: [degToRad(180), degToRad(120)],
// }
