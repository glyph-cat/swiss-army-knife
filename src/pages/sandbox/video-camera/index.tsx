import { ThemeToken, tryOnly, VideoCamera } from '@glyph-cat/swiss-army-knife'
import { BasicButton, ProgressRing, useConstructor, View } from '@glyph-cat/swiss-army-knife-react'
import { useSimpleStateValue } from 'cotton-box-react'
import { ReactNode, useCallback } from 'react'
import { CameraDisplay, CameraDisplayMode } from '~components/camera-display'
import { SandboxContent } from '~components/sandbox/content'
import { useLocalization } from '~services/localization'
import styles from './index.module.css'

// To test and make sure it doesn't break:
// * -> dispose -> dispose -> start
// * -> dispose -> dispose -> stop
// * -> start -> stop -> start -> stop
// * -> start -> start -> stop -> stop
// * -> stop -> stop -> start -> start
// * -> start -> dispose -> dispose
// * -> stop -> dispose -> dispose

export default function (): ReactNode {

  const videoCamera = useConstructor(() => {
    const newVideoCamera = new VideoCamera()
    return [newVideoCamera, newVideoCamera.dispose]
  })

  const videoCameraState = useSimpleStateValue(videoCamera.state)

  const startCamera = useCallback(async () => {
    await videoCamera.start(VideoCamera.DEFAULT_CONSTRAINTS)
  }, [videoCamera])

  const stopCamera = useCallback(async () => {
    await videoCamera.stop()
  }, [videoCamera])

  const disposeCamera = useCallback(() => {
    videoCamera.dispose()
  }, [videoCamera])

  const { localize } = useLocalization()

  const triggerOverconstrainedError = useCallback(async () => {
    tryOnly(async () => {
      await videoCamera.start(VideoCamera.createConstraintWithExactDeviceId('abc'))
    })
  }, [videoCamera])

  return (
    <SandboxContent className={styles.container}>
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
        <View style={{ gap: ThemeToken.spacingM }}>
          <View className={styles.buttonContainer}>
            <BasicButton onClick={startCamera} color='primary'>
              {localize('START')}
            </BasicButton>
            <BasicButton onClick={stopCamera}>
              {localize('STOP')}
            </BasicButton>
            <BasicButton onClick={disposeCamera}>
              {localize('DISPOSE')}
            </BasicButton>
          </View>
          <View className={styles.buttonContainer}>
            <BasicButton onClick={triggerOverconstrainedError} color='error'>
              {'Trigger OverconstrainedError'}
            </BasicButton>
          </View>
        </View>
      </View>
    </SandboxContent>
  )
}
