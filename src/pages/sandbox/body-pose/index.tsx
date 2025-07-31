import { OnePersonBodyPoseAnalyzer, VisionAnalyzerState } from '@glyph-cat/ml-helpers'
import { c, VideoCamera } from '@glyph-cat/swiss-army-knife'
import { BasicButton, ProgressRing, View } from '@glyph-cat/swiss-army-knife-react'
import { useSimpleStateValue } from 'cotton-box-react'
import { JSX, useCallback, useEffect, useState } from 'react'
import { CameraDisplay, CameraDisplayMode } from '~components/camera-display'
import { SandboxStyle } from '~constants'
import { useLocalization } from '~services/localization'
import { useGameStats } from '~utils/gamestats'
import styles from './index.module.css'

export default function (): JSX.Element {

  useGameStats()

  const [videoCamera, setVideoCamera] = useState<VideoCamera>(null)
  useEffect(() => {
    const newVideoCamera = new VideoCamera()
    setVideoCamera(newVideoCamera)
    return () => {
      setVideoCamera(null)
      newVideoCamera.dispose()
    }
  }, [])

  const [bodyPoseAnalyzer, setBodyPoseAnalyzer] = useState<OnePersonBodyPoseAnalyzer>(null)
  useEffect(() => {
    if (!videoCamera) { return } // Early exit
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
    setBodyPoseAnalyzer(newBodyPoseAnalyzer)
    return () => { newBodyPoseAnalyzer.dispose() }
  }, [videoCamera])

  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>
      {(videoCamera && bodyPoseAnalyzer) && (
        <Content
          videoCamera={videoCamera}
          bodyPoseAnalyzer={bodyPoseAnalyzer}
        />
      )}
    </View>
  )
}

interface ContentProps {
  videoCamera: VideoCamera
  bodyPoseAnalyzer: OnePersonBodyPoseAnalyzer
}

function Content({
  videoCamera,
  bodyPoseAnalyzer,
}: ContentProps): JSX.Element {

  const { localize } = useLocalization()

  const videoCameraState = useSimpleStateValue(videoCamera.state)
  const bodyPoseAnalyzerState = useSimpleStateValue(bodyPoseAnalyzer.state)

  const startCamera = useCallback(async () => {
    await videoCamera.start()
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
      await videoCamera.start()
      if (bodyPoseAnalyzer.state.get() === VisionAnalyzerState.DISPOSED) { return }
      await bodyPoseAnalyzer.start()
    })
    return () => { cancelAnimationFrame(frameRef) }
  }, [bodyPoseAnalyzer, videoCamera])

  return (
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
  )
}
