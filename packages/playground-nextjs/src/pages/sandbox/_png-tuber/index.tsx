import { BodyPoseLandmark, OnePersonBodyPoseAnalyzer } from '@glyph-cat/ml-helpers'
import { LinearEquation2D, VideoCamera } from '@glyph-cat/swiss-army-knife'
import { BasicButton, useConstructor, View } from '@glyph-cat/swiss-army-knife-react'
import clsx from 'clsx'
import { useSimpleStateValue } from 'cotton-box-react'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { CameraDisplay, CameraDisplayMode } from '~components/camera-display'
import { SandboxContent } from '~components/sandbox/content'
import { useLocalization } from '~services/localization'
import styles from './index.module.css'

export default function (): ReactNode {

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

  const [skew, setSkew] = useState(0)
  useEffect(() => {
    // new LinearEquation2D()
    const { ƒ } = LinearEquation2D.fromPoints({ x: 0, y: 10 }, { x: 1, y: -10 })
    return bodyPoseAnalyzer.result.watch((result) => {
      console.log('result[BodyPoseLandmark.NOSE].x', result[BodyPoseLandmark.NOSE].x)
      setSkew(ƒ(result[BodyPoseLandmark.NOSE].x))
    })
  }, [bodyPoseAnalyzer.result])

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

  return (
    <SandboxContent className={styles.container}>
      <View style={{
        gridTemplateColumns: 'repeat(2, 1fr)',
        height: '95vh',
        width: '65%',
        placeSelf: 'center',
      }}>
        <View style={{
          placeItems: 'center',
        }}>
          <View style={{ gap: 10 }}>
            <CameraDisplay
              displayMode={CameraDisplayMode.MESH_ONLY}
              videoCamera={videoCamera}
              bodyPoseAnalyzer={bodyPoseAnalyzer}
            />
            <View style={{ gap: 10 }}>
              {videoCameraState !== VideoCamera.State.STARTED ? (
                <BasicButton onClick={startCamera} color='primary'>
                  {localize('START')}
                </BasicButton>
              ) : (
                <BasicButton onClick={startCamera} color='primary'>
                  {localize('STOP')}
                </BasicButton>
              )}
            </View>
          </View>
        </View>
        <View style={{
          placeItems: 'center',
        }}>
          <View
            style={{
              aspectRatio: 4 / 3,
              backgroundColor: '#808080',
              backgroundImage: 'url(/assets/pngtuber.secret/Minimal_Home_Design_800x500.jpg)',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              // objectFit: 'cover',
              overflow: 'hidden',
              placeItems: 'center',
              width: 400,
            }}
          >
            <View style={{
              aspectRatio: 3 / 4,
              height: 400,
              position: 'absolute',
              bottom: '-40%',
              zIndex: 1,
              transform: `skewX(${skew}deg) rotateZ(${-skew}deg)`,
              transformOrigin: 'bottom center',
              // transform: `rotateZ(${45}deg)`,
            }}>
              <View
                className={styles.spriteBreathe}
                style={{
                  backgroundImage: 'url(/assets/pngtuber.secret/sprite.png)',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  transformOrigin: 'bottom center',
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </SandboxContent>
  )
}
