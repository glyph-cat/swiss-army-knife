import { Nullable } from '@glyph-cat/foundation'
import { ComplexHandGesture, Finger } from '@glyph-cat/ml-helpers'
import { getFirstValue, radToDeg } from '@glyph-cat/swiss-army-knife'
import { useSimpleStateValue } from 'cotton-box-react'
import { ReactNode, useEffect, useState } from 'react'
import { HandLandmarksVisualizer } from '~components/hand-landmarks-visualizer'
import { SandboxContent } from '~components/sandbox/content'
import { useGameStats } from '~utils/gamestats'
import { AppDelegate } from '../_hand-gesture/app-delegate'
import styles from './index.module.css'

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

const fingers = [
  Finger.THUMB,
  Finger.INDEX,
  Finger.MIDDLE,
  Finger.RING,
  Finger.PINKY,
]

function Content({
  appDelegate,
}: ContentProps): ReactNode {
  const handPoseResult = useSimpleStateValue(appDelegate.handPoseAnalyzer.result)
  const landmarks = getFirstValue(handPoseResult)
  return (
    <SandboxContent className={styles.container}>
      <HandLandmarksVisualizer
        landmarks={landmarks}
      />
      <table border={1} cellSpacing={0} cellPadding={10}>
        <thead>
          <tr>
            <th></th>
            <th>Inner</th>
            <th>Outer</th>
          </tr>
        </thead>
        <tbody>
          {fingers.map((finger) => {
            let innerAngle: number
            let outerAngle: number
            if (landmarks) {
              const angles = ComplexHandGesture.getFingerCurlAngles(landmarks, finger)
              innerAngle = Math.round(radToDeg(angles[0]))
              outerAngle = Math.round(radToDeg(angles[1]))
            }
            const innerCurled = innerAngle < 150
            const outerCurled = outerAngle < 90
            const curledColor = '#00ff0020'
            return (
              <tr key={finger}>
                <td>{Finger[finger]}</td>
                <td style={{
                  backgroundColor: innerCurled ? curledColor : 'transparent',
                  textAlign: 'end',
                }}>
                  <code>
                    {innerAngle ?? '0'}
                  </code>
                </td>
                <td style={{
                  backgroundColor: outerCurled ? curledColor : 'transparent',
                  textAlign: 'end',
                }}>
                  <code>
                    {outerAngle ?? '0'}
                  </code>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </SandboxContent>
  )
}
