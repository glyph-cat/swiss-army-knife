import { HandGestureSample } from 'packages/ml-helpers/src/complex-hand-gesture/test-data'
import { ReactNode } from 'react'
import { HandLandmarksVisualizer } from '~components/hand-landmarks-visualizer'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

// TODO: MotionProcessor class that accepts the height and width of the bound

// TODO: SensorArray class which bounds can be added/removed/changed during runtime, this would allow motion buttons to register themselves, but it's difficult to deal with scrolling and resize events

export default function (): ReactNode {
  return (
    <SandboxContent className={styles.container}>

      <HandLandmarksVisualizer
        landmarks={HandGestureSample.ClosedFist.FaceFront.ThumbFront}
      />

    </SandboxContent>
  )
}

