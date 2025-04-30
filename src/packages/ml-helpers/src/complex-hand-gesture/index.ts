import {
  degToRad,
  fullyEnumerate,
  getAngleFromPointsIn3D,
  hasProperty,
  NumericDataSet,
  PartialRecord,
} from '@glyph-cat/swiss-army-knife'
import { NormalizedLandmark } from '@mediapipe/hands'
import { HandPoseLandmark } from '../analyzers'

/**
 * @public
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
 * @public
 */
export enum FingerCurl {
  STRAIGHT = 1,
  HALF,
  FULL,
}

/**
 * @public
 */
export type FingerCurlExpression = {
  is: FingerCurl
  isOneOf?: never
  isNot?: never
  isNotOneOf?: never
} | {
  is?: never
  isOneOf: Array<FingerCurl>
  isNot?: never
  isNotOneOf?: never
} | {
  is?: never
  isOneOf?: never
  isNot: FingerCurl
  isNotOneOf?: never
} | {
  is?: never
  isOneOf?: never
  isNot?: never
  isNotOneOf: Array<FingerCurl>
}

interface CompactFingerCurlExpression {
  curlStates: Set<FingerCurl>
  is: boolean
}

/**
 * @public
 */
export class ComplexHandGesture {

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

  static getFingerCurlData(
    hand: Array<NormalizedLandmark>,
    finger: Finger
  ): NumericDataSet {
    return new NumericDataSet(this.getFingerCurlRawAngles(hand, finger))
  }

  static determineFingerCurl(
    hand: Array<NormalizedLandmark>,
    finger: Finger
  ): FingerCurl {
    const data = this.getFingerCurlData(hand, finger)
    if (finger !== Finger.THUMB && data.mean >= DEFAULT_STRAIGHT_THRESHOLD) {
      return FingerCurl.STRAIGHT
    } else if (data.mean >= THUMB_STRAIGHT_THRESHOLD) {
      return FingerCurl.STRAIGHT
    }
    // TOFIX: for full curl, compare all 3 angles in the array
    if (finger !== Finger.THUMB && data.mean < DEFAULT_FULL_CURL_THRESHOLD) {
      return FingerCurl.FULL
    } else if (data.mean >= THUMB_FULL_CURL_THRESHOLD) {
      return FingerCurl.FULL
    }
    return FingerCurl.HALF
  }

  /**
   * @internal
   */
  private readonly M$compactFingerCurlExpression: PartialRecord<Finger, Readonly<CompactFingerCurlExpression>>

  constructor(fingerCurlStates: PartialRecord<Finger, FingerCurlExpression>) {
    const compactFingerCurlExpression: PartialRecord<Finger, Readonly<CompactFingerCurlExpression>> = {}
    for (const curlState in fingerCurlStates) {
      const curlDefinition = fingerCurlStates[curlState as Finger]
      if (hasProperty(curlDefinition, 'is')) {
        compactFingerCurlExpression[curlState as Finger] = {
          curlStates: new Set([curlDefinition.is]),
          is: true,
        }
      } else if (hasProperty(curlDefinition, 'isOneOf')) {
        compactFingerCurlExpression[curlState as Finger] = {
          curlStates: new Set([...curlDefinition.isOneOf]),
          is: true,
        }
      } else if (hasProperty(curlDefinition, 'isNot')) {
        compactFingerCurlExpression[curlState as Finger] = {
          curlStates: new Set([curlDefinition.isNot]),
          is: false,
        }
      } else if (hasProperty(curlDefinition, 'isNotOneOf')) {
        compactFingerCurlExpression[curlState as Finger] = {
          curlStates: new Set([...curlDefinition.isNotOneOf]),
          is: false,
        }
      }
    }
    this.M$compactFingerCurlExpression = compactFingerCurlExpression
  }

  isFulfilledBy(hand: Array<NormalizedLandmark>): boolean {
    for (const curlState in this.M$compactFingerCurlExpression) {
      if (!hasProperty(this.M$compactFingerCurlExpression, curlState)) { continue }
      const fingerCurlResult = ComplexHandGesture.determineFingerCurl(hand, curlState as Finger)
      const curlDefinition = this.M$compactFingerCurlExpression[curlState as Finger]
      if (curlDefinition.is) {
        if (!curlDefinition.curlStates.has(fingerCurlResult)) {
          return false
        }
      } else {
        if (curlDefinition.curlStates.has(fingerCurlResult)) {
          return false
        }
      }
    }
    return true
  }

}

const DEFAULT_STRAIGHT_THRESHOLD = degToRad(170)
const THUMB_STRAIGHT_THRESHOLD = degToRad(150)

/**
 * @deprecated
 */
const DEFAULT_FULL_CURL_THRESHOLD = degToRad(100)

/**
 * @deprecated
 */
const THUMB_FULL_CURL_THRESHOLD = degToRad(150)

const FingerConnections = {
  [Finger.THUMB]: [
    HandPoseLandmark.WRIST,
    HandPoseLandmark.THUMB_CMC,
    HandPoseLandmark.THUMB_MCP,
    HandPoseLandmark.THUMB_IP,
    HandPoseLandmark.THUMB_TIP,
  ],
  [Finger.INDEX]: [
    HandPoseLandmark.WRIST,
    HandPoseLandmark.INDEX_FINGER_MCP,
    HandPoseLandmark.INDEX_FINGER_PIP,
    HandPoseLandmark.INDEX_FINGER_DIP,
    HandPoseLandmark.INDEX_FINGER_TIP,
  ],
  [Finger.MIDDLE]: [
    HandPoseLandmark.WRIST,
    HandPoseLandmark.MIDDLE_FINGER_MCP,
    HandPoseLandmark.MIDDLE_FINGER_PIP,
    HandPoseLandmark.MIDDLE_FINGER_DIP,
    HandPoseLandmark.MIDDLE_FINGER_TIP,
  ],
  [Finger.RING]: [
    HandPoseLandmark.WRIST,
    HandPoseLandmark.RING_FINGER_MCP,
    HandPoseLandmark.RING_FINGER_PIP,
    HandPoseLandmark.RING_FINGER_DIP,
    HandPoseLandmark.RING_FINGER_TIP,
  ],
  [Finger.PINKY]: [
    HandPoseLandmark.WRIST,
    HandPoseLandmark.PINKY_FINGER_MCP,
    HandPoseLandmark.PINKY_FINGER_PIP,
    HandPoseLandmark.PINKY_FINGER_DIP,
    HandPoseLandmark.PINKY_FINGER_TIP,
  ],
} as const
