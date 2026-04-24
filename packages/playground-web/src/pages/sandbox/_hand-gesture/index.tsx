import { Encoding, Nullable, Value2D } from '@glyph-cat/foundation'
import {
  ComplexHandGesture,
  Finger,
  FingerCurl,
  HandPoseLandmark,
  OnePersonHandPoseAnalyzerHandResult,
} from '@glyph-cat/ml-helpers'
import {
  Color,
  degToRad,
  getDistance2DByCoordinates,
  getDistance3DByCoordinates,
  Key,
} from '@glyph-cat/swiss-army-knife'
import {
  MaterialSymbol,
  ProgressRing,
  useKeyDownListener,
  useWindowDimensions,
  View,
} from '@glyph-cat/swiss-army-knife-react'
import { isString } from '@glyph-cat/type-checking'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import {
  CameraDisplay,
  CameraDisplayMode,
  LEFT_MOTION_POINTER_COLOR,
  RIGHT_MOTION_POINTER_COLOR,
} from '~components/camera-display'
import { SandboxContent } from '~components/sandbox/content'
import { useGameStats } from '~utils/gamestats'
import { AppDelegate } from './app-delegate'
import styles from './index.module.css'

const DEG_80 = degToRad(80)
const DEG_100 = degToRad(100)

const colors: Array<string> = []
for (let i = 0; i < 20; i++) {
  colors.push(Color.hsl(360 * i / 20, 65, 35).toString())
}

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

// KIV: it seems like the ML model has a hard time determining finger angle when pointing at camera
const PointingGesture = new ComplexHandGesture({
  [Finger.THUMB]: { isNot: FingerCurl.STRAIGHT },
  [Finger.INDEX]: { is: FingerCurl.FULL },
  [Finger.MIDDLE]: { is: FingerCurl.FULL },
  [Finger.RING]: { is: FingerCurl.FULL },
  [Finger.PINKY]: { is: FingerCurl.FULL },
})

// Timeout gesture to trigger pause
// Closed fist gesture to trigger scrolling
// Point gesture to trigger selection (but must be pointing towards camera)

const IDLE_OPACITY = 0.35
const ACTIVE_OPACITY = 0.85
const IDLE_SCALE = 1
const ACTIVE_SCALE = 0.65

const MOVEMENT_RATIO = 1

const PAUSE_TRIGGER_DELAY_MAX_COUNT = 1.5

/**
 * @see https://stackoverflow.com/a/42159152/5810737
 */
function getAngleFromTwoLinesIn2D(
  A1x: number,
  A1y: number,
  A2x: number,
  A2y: number,
  B1x: number,
  B1y: number,
  B2x: number,
  B2y: number,
): number {
  // temp
  const dAx = A2x - A1x
  const dAy = A2y - A1y
  const dBx = B2x - B1x
  const dBy = B2y - B1y
  let angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy)
  if (angle < 0) { angle = angle * -1 }
  const degree_angle = angle * (180 / Math.PI)
  return degree_angle
}

function saveFileBase(rawFileName: string, dataUri: string): void {
  const anchorElement = document.createElement('a')
  if (isString(anchorElement.download)) {
    anchorElement.setAttribute('href', dataUri)
    anchorElement.setAttribute('download', rawFileName)
    // NOTE: Firefox requires the link to be in the body
    document.body.appendChild(anchorElement)
    anchorElement.click()
    document.body.removeChild(anchorElement)
  } else {
    window.open(dataUri)
  }
}

function getDataUri(
  dataType: string,
  encoding: Encoding,
  value: string
): string {
  return `data:${dataType};charset=${encoding},` + encodeURIComponent('\uFEFF' + value)
}

export default function (): ReactNode {

  useGameStats()

  const [appDelegate, setAppDelegate] = useState<Nullable<AppDelegate>>(null)
  useEffect(() => {
    const $appDelegate = new AppDelegate()
    $appDelegate.startVision()
    setAppDelegate($appDelegate)
    return () => {
      (async () => {
        await $appDelegate.state.wait((s) => s > AppDelegate.State.STARTING)
        await $appDelegate.stopVision()
        await $appDelegate.dispose()
      })()
    }
  }, [])

  // return null
  return appDelegate && <Content appDelegate={appDelegate} />

}

interface ContentProps {
  appDelegate: AppDelegate
}

function Content({
  appDelegate,
}: ContentProps): ReactNode {

  const windowDimensions = useWindowDimensions()

  const [isLeftVisible, setLeftVisibleState] = useState(true) // todo
  const [isRightVisible, setRightVisibleState] = useState(true) // todo
  const [isLeftActive, setLeftActiveState] = useState(false)
  const [isRightActive, setRightActiveState] = useState(false)
  const [leftCoord, setLeftCoord] = useState<Value2D>({ x: 0.35, y: 0.5 })
  const [rightCoord, setRightCoord] = useState<Value2D>({ x: 0.65, y: 0.5 })
  useEffect(() => {
    return appDelegate.handPoseAnalyzer.result.watch((landmarks) => {
      for (const handedness in landmarks) {
        const hand = landmarks[handedness] as OnePersonHandPoseAnalyzerHandResult
        if (handedness === 'R') {
          setRightActiveState(ClosedFistGesture.isMatchedBy(hand))
          setRightCoord({
            x: hand[HandPoseLandmark.WRIST].x,
            y: hand[HandPoseLandmark.WRIST].y,
          })
        } else if (handedness === 'L') {
          setLeftActiveState(ClosedFistGesture.isMatchedBy(hand))
          setLeftCoord({
            x: hand[HandPoseLandmark.WRIST].x,
            y: hand[HandPoseLandmark.WRIST].y,
          })
        }
      }
    })
  }, [appDelegate.handPoseAnalyzer.result])

  const [isPauseGestureTriggered, setPauseGestureTriggerState] = useState(false)
  useEffect(() => {
    return appDelegate.handPoseAnalyzer.result.watch((landmarks) => {
      const { L: leftHand, R: rightHand } = landmarks
      // TODO: hands which mid finger tip is touching the other hand must be vertical
      // may be we can compare the angle of the wrist-midFinger line against bottom axis?
      setPauseGestureTriggerState((() => {
        if (leftHand && rightHand) {
          // Middle finger must touch center of other hand to form a "T" shape
          const touchDistanceThreshold = getDistance3DByCoordinates(
            rightHand[HandPoseLandmark.MIDDLE_FINGER_MCP],
            leftHand[HandPoseLandmark.MIDDLE_FINGER_PIP],
          )
          // Use 3D distance to determine threshold, but only use 2D to check for overlap
          // since we only ever expect the gesture to be front-facing anyway.
          if (
            getDistance2DByCoordinates(
              leftHand[HandPoseLandmark.MIDDLE_FINGER_TIP],
              rightHand[HandPoseLandmark.MIDDLE_FINGER_MCP],
            ) <= touchDistanceThreshold ||
            getDistance2DByCoordinates(
              rightHand[HandPoseLandmark.MIDDLE_FINGER_TIP],
              leftHand[HandPoseLandmark.MIDDLE_FINGER_MCP],
            ) <= touchDistanceThreshold
          ) {
            if (
              OpenPalmGesture.isMatchedBy(leftHand) &&
              OpenPalmGesture.isMatchedBy(rightHand)
            ) {
              const angle = getAngleFromTwoLinesIn2D(
                leftHand[HandPoseLandmark.WRIST].x,
                leftHand[HandPoseLandmark.WRIST].y,
                leftHand[HandPoseLandmark.MIDDLE_FINGER_TIP].x,
                leftHand[HandPoseLandmark.MIDDLE_FINGER_TIP].y,
                rightHand[HandPoseLandmark.WRIST].x,
                rightHand[HandPoseLandmark.WRIST].y,
                rightHand[HandPoseLandmark.MIDDLE_FINGER_TIP].x,
                rightHand[HandPoseLandmark.MIDDLE_FINGER_TIP].y,
              )
              // Check if these two lines are 90 deg (+/- 10 deg)
              return angle >= DEG_80 && angle <= DEG_100
            }
          }
        }
        return false
      })())
    })
  }, [appDelegate.handPoseAnalyzer.result])

  const [isPaused, setPausedState] = useState(false)
  const [pauseTriggerCounter, setPauseTriggerCounter] = useState(0)
  useEffect(() => {
    if (!isPauseGestureTriggered) { return } // Early exit
    const intervalRef = setInterval(() => {
      setPauseTriggerCounter(x => {
        const nextValue = x + 0.25
        if (nextValue >= PAUSE_TRIGGER_DELAY_MAX_COUNT) {
          clearInterval(intervalRef)
          setPausedState(true)
        }
        return nextValue
      })
    }, 250)
    return () => {
      clearInterval(intervalRef)
      setPauseTriggerCounter(0)
    }
  }, [isPauseGestureTriggered])

  const viewRef = useRef<View>(null)
  const prevLeftCoord = useRef<Value2D>(leftCoord)
  const prevRightCoord = useRef<Value2D>(rightCoord)
  useEffect(() => {
    if (isPaused) { return } // Early exit
    // TODO: research and implement momentum scrolling
    if (isRightActive) {
      const rightDeltaX = rightCoord.x - prevRightCoord.current.x
      const rightDeltaY = rightCoord.y - prevRightCoord.current.y
      viewRef.current?.scrollBy({
        top: -rightDeltaY * windowDimensions.height * MOVEMENT_RATIO,
        left: -rightDeltaX * windowDimensions.width * MOVEMENT_RATIO,
      })
    } else if (isLeftActive) {
      const leftDeltaX = leftCoord.x - prevLeftCoord.current.x
      const leftDeltaY = leftCoord.y - prevLeftCoord.current.y
      viewRef.current?.scrollBy({
        top: -leftDeltaY * windowDimensions.height * MOVEMENT_RATIO,
        left: -leftDeltaX * windowDimensions.width * MOVEMENT_RATIO,
      })
    }
    prevLeftCoord.current = leftCoord
    prevRightCoord.current = rightCoord
  }, [isLeftActive, isPaused, isRightActive, leftCoord, rightCoord, windowDimensions.height, windowDimensions.width])

  useKeyDownListener((e) => {
    if (e.key === Key.Space) {
      const landmarks = appDelegate.handPoseAnalyzer.result.get()
      const { L: leftHand, R: rightHand } = landmarks
      if (!rightHand && !leftHand) {
        alert('No hand data available')
        return
      }
      const handsIndicator: Array<string> = []
      if (rightHand) { handsIndicator.push('R') }
      if (leftHand) { handsIndicator.push('L') }
      const fileName = window.prompt(`File name (${handsIndicator.join('')}):`)
      if (!fileName) { return } // Early exit
      if (rightHand) {
        saveFileBase(`R${fileName}.json`, getDataUri(
          'text/plain',
          Encoding.UTF_8,
          JSON.stringify(rightHand, null, 2)
        ))
      }
      if (leftHand) {
        saveFileBase(`L${fileName}.json`, getDataUri(
          'text/plain',
          Encoding.UTF_8,
          JSON.stringify(leftHand, null, 2)
        ))
      }
    }
  }, [appDelegate.handPoseAnalyzer.result])

  return (
    <SandboxContent className={styles.container}>

      <View ref={viewRef} style={{
        gap: 40,
        gridAutoFlow: 'column',
        overflow: 'scroll',
        width: 'calc(100vw - 260px)',
      }}>
        <View style={{
          gap: 40,
          gridAutoFlow: 'column',
        }}>
          {useMemo(() => colors.map((color) => {
            return (
              <View
                key={color}
                className='code'
                style={{
                  backgroundColor: color,
                  color: '#ffffff',
                  fontSize: '24pt',
                  height: 500,
                  placeItems: 'center',
                  textAlign: 'center',
                  width: 300,
                }}
              >
                {color}
              </View>
            )
          }), [])}
        </View>
      </View>

      <View className={styles.pointer} style={{
        backgroundColor: LEFT_MOTION_POINTER_COLOR,
        left: `${100 * leftCoord.x}%`,
        top: `${100 * leftCoord.y}%`,
        opacity: isLeftVisible ? (isLeftActive ? ACTIVE_OPACITY : IDLE_OPACITY) : 0,
        transform: `scale(${isLeftActive ? ACTIVE_SCALE : IDLE_SCALE})`,
      }} />

      <View className={styles.pointer} style={{
        backgroundColor: RIGHT_MOTION_POINTER_COLOR,
        left: `${100 * rightCoord.x}%`,
        top: `${100 * rightCoord.y}%`,
        opacity: isRightVisible ? (isRightActive ? ACTIVE_OPACITY : IDLE_OPACITY) : 0,
        transform: `scale(${isRightActive ? ACTIVE_SCALE : IDLE_SCALE})`,
      }} />

      <View style={{
        backdropFilter: 'blur(5px)',
        backgroundColor: '#00000080',
        height: '100vh',
        left: 0,
        placeItems: 'center',
        position: 'fixed',
        pointerEvents: 'none',
        top: 0,
        width: '100vw',
        opacity: (isPaused || pauseTriggerCounter > 0) ? 1 : 0,
        transition: '0.3s',
      }}>
        {(!isPaused &&
          pauseTriggerCounter > 0 &&
          pauseTriggerCounter < PAUSE_TRIGGER_DELAY_MAX_COUNT
        ) && (<ProgressRing
          value={pauseTriggerCounter}
          minValue={0}
          maxValue={PAUSE_TRIGGER_DELAY_MAX_COUNT}
          size={300}
          color='#ffffff'
        />)}
        {isPaused && (
          <MaterialSymbol
            name='pause_circle'
            size={300}
            color='#ffffff'
          />
        )}
      </View>

      <CameraDisplay
        className={styles.floatingCameraDisplay}
        displayMode={CameraDisplayMode.MESH_ONLY}
        videoCamera={appDelegate.videoCamera}
        bodyPoseAnalyzer={appDelegate.bodyPoseAnalyzer}
        handPoseAnalyzer={appDelegate.handPoseAnalyzer}
        style={{ left: 0 }}
      />

    </SandboxContent>
  )
}
