import { OnePersonBodyPoseAnalyzer, VisionAnalyzerState } from '@glyph-cat/ml-helpers'
import { VideoCamera } from '@glyph-cat/swiss-army-knife'
import { BasicButton, ProgressRing, useConstructor, View } from '@glyph-cat/swiss-army-knife-react'
import { useSimpleStateValue } from 'cotton-box-react'
import { ReactNode, useCallback, useEffect } from 'react'
import { CameraDisplay, CameraDisplayMode } from '~components/camera-display'
import { SandboxContent } from '~components/sandbox/content'
import { useLocalization } from '~services/localization'
import { useGameStats } from '~utils/gamestats'
import styles from './index.module.css'

export default function (): ReactNode {

  useGameStats()

  const { localize } = useLocalization()

  const videoCamera = useConstructor(() => {
    const newVideoCamera = new VideoCamera()
    return [newVideoCamera, newVideoCamera.dispose]
  })
  const videoCameraState = useSimpleStateValue(videoCamera.state)

  const bodyPoseAnalyzer = useConstructor(() => {
    const newBodyPoseAnalyzer = new OnePersonBodyPoseAnalyzer(videoCamera.videoElement, {
      baseOptions: {
        modelAssetPath: '/mediapipe/models/pose_landmarker_lite.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
    }, {
      initializeImmediately: true,
      flipHorizontally: true,
    })
    return [newBodyPoseAnalyzer, newBodyPoseAnalyzer.dispose]
  })
  const bodyPoseAnalyzerState = useSimpleStateValue(bodyPoseAnalyzer.state)

  const startCamera = useCallback(async () => {
    await videoCamera.start(VideoCamera.DEFAULT_CONSTRAINTS)
    await bodyPoseAnalyzer.start()
  }, [bodyPoseAnalyzer, videoCamera])

  const stopCamera = useCallback(async () => {
    await bodyPoseAnalyzer.stop()
    await videoCamera.stop()
  }, [bodyPoseAnalyzer, videoCamera])

  const disposeCamera = useCallback(async () => {
    await bodyPoseAnalyzer.dispose()
    await videoCamera.dispose()
  }, [bodyPoseAnalyzer, videoCamera])

  useEffect(() => {
    return
    const frameRef = requestAnimationFrame(async () => {
      await videoCamera.start(VideoCamera.DEFAULT_CONSTRAINTS)
      if (bodyPoseAnalyzer.state.get() === VisionAnalyzerState.DISPOSED) { return }
      await bodyPoseAnalyzer.start()
    })
    return () => { cancelAnimationFrame(frameRef) }
  }, [bodyPoseAnalyzer, videoCamera])

  return (
    <SandboxContent className={styles.container}>
      <View className={styles.subContainer}>
        <code>
          {'VideoCamera.state: '}
          {VideoCamera.State[videoCameraState]}
          <br />
          {'OnePersonBodyPoseAnalyzer.state: '}
          {VisionAnalyzerState[bodyPoseAnalyzerState]}
        </code>
        <View className={styles.cameraDisplayContainer}>
          <CameraDisplay
            displayMode={CameraDisplayMode.ALL}
            videoCamera={videoCamera}
            bodyPoseAnalyzer={bodyPoseAnalyzer}
          />
          {videoCameraState === VideoCamera.State.STARTING && (
            <ProgressRing className={styles.progressRing} color='#808080' />
          )}
        </View>
        <View className={styles.buttonContainer}>
          <BasicButton
            onClick={startCamera}
            disabled={bodyPoseAnalyzerState === VisionAnalyzerState.DISPOSED}
          >
            {localize('START')}
          </BasicButton>
          <BasicButton onClick={stopCamera}>
            {localize('STOP')}
          </BasicButton>
          <BasicButton onClick={disposeCamera}>
            {localize('DISPOSE')}
          </BasicButton>
        </View>
      </View>
    </SandboxContent>
  )
}
