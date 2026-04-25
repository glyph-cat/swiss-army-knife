import { Nullable, Value2D } from '@glyph-cat/foundation'
import {
  ComplexHandGesture,
  Finger,
  FingerCurl,
  HandPoseLandmark,
  OnePersonHandPoseAnalyzerHandResult,
} from '@glyph-cat/ml-helpers'
import { getWindowDimensions } from '@glyph-cat/swiss-army-knife'
import {
  ButtonBase,
  ButtonBaseProps,
  useWindowDimensions,
  View,
} from '@glyph-cat/swiss-army-knife-react'
import { useSimpleStateValue } from 'cotton-box-react'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  CameraDisplay,
  CameraDisplayMode,
  LEFT_MOTION_POINTER_COLOR,
  RIGHT_MOTION_POINTER_COLOR,
} from '~components/camera-display'
import { HandLandmarksVisualizer } from '~components/hand-landmarks-visualizer'
import { SandboxContent } from '~components/sandbox/content'
import { useGameStats } from '~utils/gamestats'
import { AppDelegate } from '../_hand-gesture/app-delegate'
import styles from './index.module.css'
import { SONG_LIST } from './song-list'

const IDLE_OPACITY = 0.35
const ACTIVE_OPACITY = 0.85
const IDLE_SCALE = 1
const ACTIVE_SCALE = 0.65

const MOVEMENT_RATIO = 1

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
        setAppDelegate(null)
      })()
    }
  }, [])

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
  // const [leftCoord, setLeftCoord] = useState<Value2D>({ x: 0, y: 0 })
  // const [rightCoord, setRightCoord] = useState<Value2D>({ x: 0.75, y: 0.5 })
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

  const viewRef = useRef<View>(null)
  const prevLeftCoord = useRef<Value2D>(leftCoord)
  const prevRightCoord = useRef<Value2D>(rightCoord)
  useEffect(() => {
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
  }, [isLeftActive, isRightActive, leftCoord, rightCoord, windowDimensions.height, windowDimensions.width])

  const [selectedSongIndex, setSelectedSongIndex] = useState(0)

  const handLandmarks = useSimpleStateValue(appDelegate.handPoseAnalyzer.result)

  return (
    <SandboxContent className={styles.container}>

      <PropagatedState value={{ leftCoord, rightCoord }}>
        <View ref={viewRef} className={styles.listContainer}>
          {SONG_LIST.map((song, index) => {
            return (
              <MotionButton
                key={index}
                className={styles.itemContainer}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => {
                  setSelectedSongIndex(index)
                }}
                data-selected={selectedSongIndex === index}
              >
                <View
                  className={styles.coverImage}
                  style={{ backgroundImage: `url(/assets/cover-images.secret/${song.imageUrl})` }}
                />
                <span className={styles.title}>
                  {song.title}
                </span>
                <span className={styles.artist}>
                  {song.artist}
                </span>
              </MotionButton>
            )
          })}
        </View>
      </PropagatedState>

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
        bottom: 0,
        gridTemplateColumns: 'auto 1fr auto',
        justifySelf: 'center',
        position: 'absolute',
        width: 'calc(100% - 2 * 100px)',
      }}>
        <HandLandmarksVisualizer
          landmarks={handLandmarks.L}
        />
        <View />
        <HandLandmarksVisualizer
          landmarks={handLandmarks.R}
        />
      </View>

    </SandboxContent>
  )
}

const OpenPalmGesture = new ComplexHandGesture({
  [Finger.THUMB]: { is: FingerCurl.STRAIGHT },
  [Finger.INDEX]: { is: FingerCurl.STRAIGHT },
  [Finger.MIDDLE]: { is: FingerCurl.STRAIGHT },
  [Finger.RING]: { is: FingerCurl.STRAIGHT },
  [Finger.PINKY]: { is: FingerCurl.STRAIGHT },
})

const ClosedFistGesture = new ComplexHandGesture({
  // [Finger.THUMB]: { isNot: FingerCurl.STRAIGHT },
  [Finger.INDEX]: { is: FingerCurl.FULL },
  [Finger.MIDDLE]: { is: FingerCurl.FULL },
  [Finger.RING]: { is: FingerCurl.FULL },
  [Finger.PINKY]: { is: FingerCurl.FULL },
})

const PointingGesture = new ComplexHandGesture({
  // [Finger.THUMB]: { isNot: FingerCurl.STRAIGHT },
  [Finger.INDEX]: { is: FingerCurl.FULL },
  [Finger.MIDDLE]: { is: FingerCurl.FULL },
  [Finger.RING]: { is: FingerCurl.FULL },
  [Finger.PINKY]: { is: FingerCurl.FULL },
})

interface IPropagatedState {
  leftCoord: Value2D
  rightCoord: Value2D
}

const PropagatedState = createContext<Nullable<IPropagatedState>>(null)

function MotionButton({
  children,
  ...props
}: ButtonBaseProps): ReactNode {

  const { leftCoord, rightCoord } = useContext(PropagatedState)!

  const [isHovering, setHoverState] = useState(false)
  const buttonRef = useRef<ButtonBase>(null)
  useLayoutEffect(() => {
    const windowDimensions = getWindowDimensions()
    const target = buttonRef.current!
    const bounds = target.getBoundingClientRect()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHoverState(
      (
        leftCoord.x >= (bounds.x / windowDimensions.width) &&
        leftCoord.x <= ((bounds.x + bounds.width) / windowDimensions.width) &&
        leftCoord.y >= (bounds.y / windowDimensions.height) &&
        leftCoord.y <= ((bounds.y + bounds.height) / windowDimensions.height)
      ) ||
      (
        rightCoord.x >= (bounds.x / windowDimensions.width) &&
        rightCoord.x <= ((bounds.x + bounds.width) / windowDimensions.width) &&
        rightCoord.y >= (bounds.y / windowDimensions.height) &&
        rightCoord.y <= ((bounds.y + bounds.height) / windowDimensions.height)
      )
    )

  }, [leftCoord, rightCoord])
  // TODO: subscribe to hand move and finger point events, if point overlaps with button bounds, trigger hover/click accordingly

  return (
    <ButtonBase
      ref={buttonRef}
      className={styles.itemContainer}
      data-hover={isHovering}
      {...props}
    >
      {children}
    </ButtonBase>
  )

}
