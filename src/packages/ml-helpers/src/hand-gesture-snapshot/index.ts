import {
  fullyEnumerate,
  getAngleFromPointsIn3D,
  isInRange,
  NumericDataSet,
  StringRecord,
} from '@glyph-cat/swiss-army-knife'
import { NormalizedLandmark } from '@mediapipe/hands'
import { HandPoseLandmark } from '../analyzers'

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

interface ProcessedDataPoint {
  mean: number
  stdDev: number
}

/**
 * @internal
 */
export class HandGestureSnapshot {

  static getFingerCurlAngles(
    hand: Array<NormalizedLandmark>,
    finger: Finger
  ): StringRecord<number> {
    const fingerConnection = FingerConnections[finger]
    const angles: StringRecord<number> = {}
    for (let i = 0; i < (fingerConnection.length - 2); i++) {
      const connectionA = fingerConnection[i]
      const connectionMidpoint = fingerConnection[i + 1]
      const connectionB = fingerConnection[i + 2]
      const jointConnectionKey = [connectionA, connectionMidpoint, connectionB].join('-')
      const pointA = hand[connectionA]
      const midPoint = hand[connectionMidpoint]
      const pointB = hand[connectionB]
      angles[jointConnectionKey] = getAngleFromPointsIn3D(midPoint, pointA, pointB)
    }
    return angles
  }

  private readonly processedPoints: StringRecord<ProcessedDataPoint>

  constructor(landmarkSnapshots: Array<Array<NormalizedLandmark>>) {
    const halfProcessedPoints: StringRecord<Array<number>> = {}
    for (const landmarkSnapshot of landmarkSnapshots) {
      for (const finger in FingerConnections) {
        const angles = HandGestureSnapshot.getFingerCurlAngles(landmarkSnapshot, finger as Finger)
        for (const jointConnectionKey in angles) {
          if (!halfProcessedPoints[jointConnectionKey]) {
            halfProcessedPoints[jointConnectionKey] = []
          }
          halfProcessedPoints[jointConnectionKey].push(angles[jointConnectionKey])
        }
      }
    }
    const processedPoints: StringRecord<ProcessedDataPoint> = {}
    for (const jointConnectionKey in halfProcessedPoints) {
      const numericDataSet = new NumericDataSet(halfProcessedPoints[jointConnectionKey])
      processedPoints[jointConnectionKey] = {
        mean: numericDataSet.mean,
        stdDev: numericDataSet.stddev,
      }
    }
    this.processedPoints = processedPoints
  }

  isMatchedBy(hand: Array<NormalizedLandmark>, sigma: number = 2): boolean {
    for (const finger in FingerConnections) {
      const angles = HandGestureSnapshot.getFingerCurlAngles(hand, finger as Finger)
      for (const jointConnectionKey in angles) {
        const { mean, stdDev } = this.processedPoints[jointConnectionKey]
        // temp
        // console.log(`stdDev for ${jointConnectionKey}`, stdDev)
        // console.log('='.repeat(20))
        // console.log(`angle for ${jointConnectionKey}`, angles[jointConnectionKey])
        // console.log([mean - (stdDev * sigma), mean, mean + (stdDev * sigma)].join(' <-> '))
        // console.log('is in range', isInRange(
        //   angles[jointConnectionKey],
        //   mean - (stdDev * sigma),
        //   mean + (stdDev * sigma),
        // ))
        if (!isInRange(
          angles[jointConnectionKey],
          mean - (stdDev * sigma),
          mean + (stdDev * sigma),
        )) { return false }
      }
    }
    return true
  }

}

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
