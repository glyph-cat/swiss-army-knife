import { Encoding, Nullable } from '@glyph-cat/foundation'
import { delay, Key } from '@glyph-cat/swiss-army-knife'
import { useKeyDownListener, View } from '@glyph-cat/swiss-army-knife-react'
import { isString } from '@glyph-cat/type-checking'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { CameraDisplay, CameraDisplayMode } from '~components/camera-display'
import { useGameStats } from '~utils/gamestats'
import { AppDelegate } from '../_hand-gesture/app-delegate'
import styles from './index.module.css'

// Each gesture has 6 sides × 4 orientations × 2 hands = 48 samples to test
const hands = ['Right', 'Left']
const diceSides = ['Front', 'Left', 'Right', 'Up', 'Down', 'Back']
const orientations = [0, 90, 180, 270]

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

  return appDelegate && <Content appDelegate={appDelegate} />

}

interface ContentProps {
  appDelegate: AppDelegate
}

function Content({
  appDelegate,
}: ContentProps): ReactNode {


  const [countdown, setCountdown] = useState(3)
  const [upcomingFileName, setUpcomingFileName] = useState('...')

  const doCountdown = useCallback(async () => {
    setCountdown(3)
    await delay(1000)
    setCountdown(2)
    await delay(1000)
    setCountdown(1)
    await delay(1000)
    setCountdown(0)
  }, [])

  const [capturing, setCapturingState] = useState(false)
  const capturingRef = useRef(capturing)

  const beginCapture = useCallback(async () => {
    for (const hand of hands) {
      for (const diceSide of diceSides) {
        for (const orientation of orientations) {
          if (!capturingRef.current) { break }
          const fileName = [hand, diceSide, String(orientation).padStart(3, '0')].join('-')
          setUpcomingFileName(fileName)
          await doCountdown()
          const allLandmarks = appDelegate.handPoseAnalyzer.result.get()
          const handLandmarks = (hand === 'Right' ? allLandmarks.R : allLandmarks.L) ?? []
          saveFileBase(`${fileName}.json`, getDataUri(
            'text/plain',
            Encoding.UTF_8,
            JSON.stringify(handLandmarks, null, 2)
          ))
        }
      }
    }
  }, [appDelegate.handPoseAnalyzer.result, doCountdown])

  useKeyDownListener((e) => {
    if (e.key === Key.Space) {
      if (!capturing) {
        capturingRef.current = true
        beginCapture()
      } else {
        capturingRef.current = false
      }
      setCapturingState(s => !s)
    }
  }, [beginCapture, capturing])

  return (
    <View className={styles.container}>
      <View className={styles.subContainer}>
        <span style={{ fontSize: '32pt' }}>{countdown}</span>
        <code style={{ fontSize: '20pt' }}>{upcomingFileName}</code>
        <CameraDisplay
          displayMode={CameraDisplayMode.MESH_ONLY}
          videoCamera={appDelegate.videoCamera}
          bodyPoseAnalyzer={appDelegate.bodyPoseAnalyzer}
          handPoseAnalyzer={appDelegate.handPoseAnalyzer}
        />
      </View>
    </View>
  )
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
