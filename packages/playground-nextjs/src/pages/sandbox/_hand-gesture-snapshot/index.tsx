import {
  drawConnectors,
  drawLandmarks,
  Finger,
  HAND_CONNECTIONS,
  HandGestureSnapshot,
} from '@glyph-cat/ml-helpers'
import { MaterialSymbol, View } from '@glyph-cat/swiss-army-knife-react'
import { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { ReactNode, useLayoutEffect, useRef } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

import L1 from './snapshots/L1.json'
import L2 from './snapshots/L2.json'
import L3 from './snapshots/L3.json'
import R1 from './snapshots/R1.json'
import R2 from './snapshots/R2.json'
import R3 from './snapshots/R3.json'
import RX from './snapshots/RX.json'

const OpenPalmGestureSnapshot = new HandGestureSnapshot([R1, R2, R3, L1, L2, L3])
const RightOpenPalmGestureSnapshot = new HandGestureSnapshot([R1, R2, R3])
const LeftOpenPalmGestureSnapshot = new HandGestureSnapshot([L1, L2, L3])

const AllSnapshots: Array<LandmarkStatsProps> = [
  {
    label: 'R1',
    landmarks: R1,
    snapshotToMatch: RightOpenPalmGestureSnapshot,
    gestureName: 'Open palm',
  },
  {
    label: 'R2',
    landmarks: R2,
    snapshotToMatch: RightOpenPalmGestureSnapshot,
    gestureName: 'Open palm',
  },
  {
    label: 'R3',
    landmarks: R3,
    snapshotToMatch: RightOpenPalmGestureSnapshot,
    gestureName: 'Open palm',
  },
  {
    label: 'RX',
    landmarks: RX,
    snapshotToMatch: RightOpenPalmGestureSnapshot,
    gestureName: 'Open palm',
  },
  {
    label: 'L1',
    landmarks: L1,
    snapshotToMatch: LeftOpenPalmGestureSnapshot,
    gestureName: 'Open palm',
  },
  {
    label: 'L2',
    landmarks: L2,
    snapshotToMatch: LeftOpenPalmGestureSnapshot,
    gestureName: 'Open palm',
  },
  {
    label: 'L3',
    landmarks: L3,
    snapshotToMatch: LeftOpenPalmGestureSnapshot,
    gestureName: 'Open palm',
  },
] as const

const passingSnapshotsCount = AllSnapshots.map(({ landmarks, snapshotToMatch }) => {
  // return gestureToMatch.isFulfilledBy(landmarks)
  return snapshotToMatch.isMatchedBy(landmarks)
}).filter(s => s === true).length

export default function (): ReactNode {
  return (
    <SandboxContent className={styles.container}>

      <h1>Passed: {passingSnapshotsCount}/{AllSnapshots.length}</h1>

      <pre style={{
        fontSize: '12pt',
        margin: 0,
        padding: 0,
      }}>
        <code>
          {JSON.stringify(OpenPalmGestureSnapshot['processedPoints'], null, 2)}
        </code>
      </pre>
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
  snapshotToMatch: HandGestureSnapshot
  gestureName: string
}

function LandmarkStats({
  label,
  landmarks,
  snapshotToMatch,
  gestureName,
}: LandmarkStatsProps): ReactNode {

  const gestureIsMatched = snapshotToMatch.isMatchedBy(landmarks)

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
            {JSON.stringify({
              ...HandGestureSnapshot.getFingerCurlAngles(
                landmarks,
                Finger.THUMB,
              ),
              ...HandGestureSnapshot.getFingerCurlAngles(
                landmarks,
                Finger.INDEX,
              ),
              ...HandGestureSnapshot.getFingerCurlAngles(
                landmarks,
                Finger.MIDDLE,
              ),
              ...HandGestureSnapshot.getFingerCurlAngles(
                landmarks,
                Finger.RING,
              ),
              ...HandGestureSnapshot.getFingerCurlAngles(
                landmarks,
                Finger.PINKY,
              ),
            }, null, 2)}
          </code>
        </pre>
      </View>
    </View>
  )
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
