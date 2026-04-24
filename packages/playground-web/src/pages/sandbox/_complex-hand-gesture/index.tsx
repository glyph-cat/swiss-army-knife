import {
  ComplexHandGesture,
  drawConnectors,
  drawLandmarks,
  Finger,
  FingerCurl,
  HAND_CONNECTIONS,
} from '@glyph-cat/ml-helpers'
import { radToDeg } from '@glyph-cat/swiss-army-knife'
import { MaterialSymbol, View } from '@glyph-cat/swiss-army-knife-react'
import { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { HandGestureSample } from 'packages/ml-helpers/src/complex-hand-gesture/test-data'
import { ReactNode, useLayoutEffect, useRef } from 'react'
import styles from './index.module.css'

import RightOpenPalm01 from './samples.draft/right-open-palm-01.json'
import RightOpenPalm02 from './samples.draft/right-open-palm-02.json'
import RightOpenPalm03 from './samples.draft/right-open-palm-03.json'
import RightOpenPalm04 from './samples.draft/right-open-palm-04.json'
import RightOpenPalm05 from './samples.draft/right-open-palm-05.json'

import { SandboxContent } from '~components/sandbox/content'
import RFaceDownThumbFront from './samples.draft/Rface-down-thumb-front.json'
import RFaceDownThumbSide from './samples.draft/Rface-down-thumb-side.json'
import RFaceLeftThumbFront from './samples.draft/Rface-left-thumb-front.json'
import RFaceLeftThumbSide from './samples.draft/Rface-left-thumb-side.json'

// Note: each gesture have 6 sides × 4 orientations × 2 hands = 48 samples to test
// - Six sides (think of a cube) — up (facing sky), down (facing ground), left, right, front (facing camera), back (facing self)
// - Four orientations — 0º, 90º, 180º, 270º
// - 2 hands — left, right
// …but this doesn't take into consideration some variants such as thumb placement for closed fist gesture

const OpenPalmGesture = new ComplexHandGesture({
  [Finger.THUMB]: { is: FingerCurl.STRAIGHT },
  [Finger.INDEX]: { is: FingerCurl.STRAIGHT },
  [Finger.MIDDLE]: { is: FingerCurl.STRAIGHT },
  [Finger.RING]: { is: FingerCurl.STRAIGHT },
  [Finger.PINKY]: { is: FingerCurl.STRAIGHT },
})

const ClosedFistGesture = new ComplexHandGesture({
  [Finger.THUMB]: { isNot: FingerCurl.STRAIGHT },
  [Finger.INDEX]: { is: FingerCurl.FULL },
  [Finger.MIDDLE]: { is: FingerCurl.FULL },
  [Finger.RING]: { is: FingerCurl.FULL },
  [Finger.PINKY]: { is: FingerCurl.FULL },
})

const AllSnapshots: Array<LandmarkStatsProps> = [
  {
    label: 'Front-facing (upright)',
    landmarks: RightOpenPalm01,
    gestureToMatch: OpenPalmGesture,
    gestureName: 'Open palm',
  },
  {
    label: 'Left-facing (upright)',
    landmarks: RightOpenPalm02,
    gestureToMatch: OpenPalmGesture,
    gestureName: 'Open palm',
  },
  {
    label: 'Right-facing (upright)',
    landmarks: RightOpenPalm03,
    gestureToMatch: OpenPalmGesture,
    gestureName: 'Open palm',
  },
  {
    label: 'Downward-facing',
    landmarks: RightOpenPalm04,
    gestureToMatch: OpenPalmGesture,
    gestureName: 'Open palm',
  },
  {
    label: 'Upward-facing',
    landmarks: RightOpenPalm05,
    gestureToMatch: OpenPalmGesture,
    gestureName: 'Open palm',
  },
  {
    label: 'RFaceFrontThumbFront',
    landmarks: HandGestureSample.ClosedFist.FaceFront.ThumbFront,
    gestureToMatch: ClosedFistGesture,
    gestureName: 'Closed fist',
  },
  {
    label: 'RFaceFrontThumbSide',
    landmarks: HandGestureSample.ClosedFist.FaceFront.ThumbSide,
    gestureToMatch: ClosedFistGesture,
    gestureName: 'Closed fist',
  },
  {
    label: 'RFaceDownThumbFront',
    landmarks: RFaceDownThumbFront,
    gestureToMatch: ClosedFistGesture,
    gestureName: 'Closed fist',
  },
  {
    label: 'RFaceDownThumbSide',
    landmarks: RFaceDownThumbSide,
    gestureToMatch: ClosedFistGesture,
    gestureName: 'Closed fist',
  },
  {
    label: 'RFaceLeftThumbFront',
    landmarks: RFaceLeftThumbFront,
    gestureToMatch: ClosedFistGesture,
    gestureName: 'Closed fist',
  },
  {
    label: 'RFaceLeftThumbSide',
    landmarks: RFaceLeftThumbSide,
    gestureToMatch: ClosedFistGesture,
    gestureName: 'Closed fist',
  },
] as const

const passingSnapshotsCount = AllSnapshots.map(({ landmarks, gestureToMatch }) => {
  return gestureToMatch.isMatchedBy(landmarks)
}).filter(s => s === true).length

export default function (): ReactNode {
  return (
    <SandboxContent className={styles.container}>

      <h1>Passed: {passingSnapshotsCount}/{AllSnapshots.length}</h1>

      {AllSnapshots.map((props, index) => {
        return (
          <LandmarkStats
            key={index}
            {...props}
          />
        )
      })}

    </SandboxContent>
  )
}

interface LandmarkStatsProps {
  label: string
  landmarks: Array<NormalizedLandmark>
  gestureToMatch: ComplexHandGesture
  gestureName: string
}

function LandmarkStats({
  label,
  landmarks,
  gestureToMatch,
  gestureName,
}: LandmarkStatsProps): ReactNode {

  const gestureIsMatched = gestureToMatch.isMatchedBy(landmarks)

  return (
    <View style={{
      gap: 10,
      gridAutoColumns: 'max-content',
      gridAutoFlow: 'column',
    }}>
      <LandmarkDisplay
        landmarks={landmarks}
      />
      <View style={{
        gridAutoRows: 'max-content',
      }}>
        <span style={{
          fontSize: '18pt',
          fontWeight: 'bold',
          opacity: 0.5,
        }}>{label}</span>
        <View style={{ gridAutoFlow: 'column' }}>
          <MaterialSymbol
            name={gestureIsMatched ? 'check' : 'close'}
            color={gestureIsMatched ? '#00b54b' : '#ff4b4b'}
          />
          <span>
            {'Matches '}
            <u>{gestureName}</u>
            {' gesture: '}
            {gestureIsMatched ? 'Yes' : 'No'}
          </span>
        </View>
        <pre style={{
          fontSize: '12pt',
          margin: 0,
          padding: 0,
        }}>
          <code>
            {` THUMB: [${ComplexHandGesture.getFingerCurlAngles(
              landmarks,
              Finger.THUMB,
            ).map(angleValueMapper).join(', ')}]`}
            <br />
            {` INDEX: [${ComplexHandGesture.getFingerCurlAngles(
              landmarks,
              Finger.INDEX,
            ).map(angleValueMapper).join(', ')}]`}
            <br />
            {`MIDDLE: [${ComplexHandGesture.getFingerCurlAngles(
              landmarks,
              Finger.MIDDLE,
            ).map(angleValueMapper).join(', ')}]`}
            <br />
            {`  RING: [${ComplexHandGesture.getFingerCurlAngles(
              landmarks,
              Finger.RING,
            ).map(angleValueMapper).join(', ')}]`}
            <br />
            {` PINKY: [${ComplexHandGesture.getFingerCurlAngles(
              landmarks,
              Finger.PINKY,
            ).map(angleValueMapper).join(', ')}]`}
          </code>
        </pre>
      </View>
    </View>
  )
}

function angleValueMapper(value: number): number {
  return Math.round(radToDeg(value))
}

interface LandmarkDisplayProps {
  landmarks: Array<NormalizedLandmark>
}

function LandmarkDisplay({
  landmarks,
}: LandmarkDisplayProps): ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useLayoutEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) {
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
        color: '#808080',
      })
      drawLandmarks(ctx, landmarks, {
        color: '#2b80ff',
        radius: 3,
      })
    }
  }, [landmarks])
  return (
    <canvas
      className={styles.landmarkDisplayCanvas}
      ref={canvasRef}
    />
  )
}
