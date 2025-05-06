import { c, VideoCamera } from '@glyph-cat/swiss-army-knife'
import { View } from '@glyph-cat/swiss-army-knife-react'
import { useSimpleStateValue } from 'cotton-box-react'
import { JSX, useCallback, useEffect, useState } from 'react'
import { CameraDisplay, CameraDisplayMode } from '~components/camera-display'
import { SandboxStyle } from '~constants'
import { BasicButton, ProgressRing } from '~unstable/basic-ui'
import styles from './index.module.css'

// To test and make sure it doesn't break:
// * -> dispose -> dispose -> start
// * -> dispose -> dispose -> stop
// * -> start -> stop -> start -> stop
// * -> start -> start -> stop -> stop
// * -> stop -> stop -> start -> start
// * -> start -> dispose -> dispose
// * -> stop -> dispose -> dispose

export default function (): JSX.Element {

  const [videoCamera, setVideoCamera] = useState<VideoCamera>(null)
  useEffect(() => {
    const newVideoCamera = new VideoCamera()
    setVideoCamera(newVideoCamera)
    return () => {
      setVideoCamera(null)
      newVideoCamera.dispose()
    }
  }, [])

  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>
      {videoCamera && <Content videoCamera={videoCamera} />}
    </View>
  )
}

interface ContentProps {
  videoCamera: VideoCamera
}

function Content({ videoCamera }: ContentProps): JSX.Element {

  const videoCameraState = useSimpleStateValue(videoCamera.state)

  const startCamera = useCallback(() => {
    videoCamera.start()
  }, [videoCamera])

  const stopCamera = useCallback(() => {
    videoCamera.stop()
  }, [videoCamera])

  const disposeCamera = useCallback(() => {
    videoCamera.dispose()
  }, [videoCamera])

  return (
    <View className={styles.subContainer}>
      <span>
        {'state: '}
        <code>{VideoCamera.State[videoCameraState]}</code>
      </span>
      <View className={styles.cameraDisplayContainer}>
        <CameraDisplay
          displayMode={CameraDisplayMode.VIDEO_ONLY}
          videoCamera={videoCamera}
        />
        {videoCameraState === VideoCamera.State.STARTING && (
          <ProgressRing className={styles.progressRing} color='#808080' />
        )}
      </View>
      <View className={styles.buttonContainer}>
        <BasicButton onClick={startCamera}>
          {'Start'}
        </BasicButton>
        <BasicButton onClick={stopCamera}>
          {'Stop'}
        </BasicButton>
        <BasicButton onClick={disposeCamera}>
          {'Dispose'}
        </BasicButton>
      </View>
    </View>
  )
}
