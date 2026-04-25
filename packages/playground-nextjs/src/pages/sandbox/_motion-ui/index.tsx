import { Nullable } from '@glyph-cat/foundation'
import { BodyPoseLandmark, OnePersonBodyPoseAnalyzer } from '@glyph-cat/ml-helpers'
import { VideoCamera } from '@glyph-cat/swiss-army-knife'
import { View } from '@glyph-cat/swiss-army-knife-react'
import { PoseLandmarker } from '@mediapipe/tasks-vision'
import clsx from 'clsx'
import { SimpleStateManager } from 'cotton-box'
import { useSimpleStateValue } from 'cotton-box-react'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { BodyMeshVisualizer } from '~components/bodymesh-visualizer'
import { CameraDisplay, CameraDisplayMode } from '~components/camera-display'
import { MeshVisualizer, convertConnection } from '~components/mesh-visualizer'
import { useGameStats } from '~utils/gamestats'
import styles from './index.module.css'

const POSE_CONNECTIONS = convertConnection(PoseLandmarker.POSE_CONNECTIONS)

export default function (): ReactNode {

  // useGameStats()

  const [videoCamera, setVideoCamera] = useState<Nullable<VideoCamera>>(null)
  const [bodyPoseAnalyzer, setBodyPoseAnalyzer] = useState<Nullable<OnePersonBodyPoseAnalyzer>>(null)
  useEffect(() => {

    const newVideoCamera = new VideoCamera()
    setVideoCamera(newVideoCamera)

    const newBodyPoseAnalyzer = new OnePersonBodyPoseAnalyzer(newVideoCamera.videoElement, {
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

    const x = async () => {
      await newVideoCamera.start(VideoCamera.DEFAULT_CONSTRAINTS)
      await newBodyPoseAnalyzer.start()
    }; x()

    return () => {
      newBodyPoseAnalyzer.dispose()
      setBodyPoseAnalyzer(null)
      newVideoCamera.stop()
      setVideoCamera(null)
    }
  }, [])

  return (videoCamera && bodyPoseAnalyzer) && (
    <Content
      videoCamera={videoCamera}
      bodyPoseAnalyzer={bodyPoseAnalyzer}
    />
  )

}

interface ContentProps {
  videoCamera: VideoCamera
  bodyPoseAnalyzer: OnePersonBodyPoseAnalyzer
}

function Content({
  videoCamera,
  bodyPoseAnalyzer,
}: ContentProps): ReactNode {

  const colors = useMemo(() => new Array(20).fill(null).map(() => {
    return 'rgb(' + [0, 0, 0].map(() => Math.floor(Math.random() * 256)).join(',') + ')'
  }), [])

  const landmarks = useSimpleStateValue(bodyPoseAnalyzer.result)
  // console.log('z', x[BodyPoseLandmark.LEFT_WRIST]?.z)

  return (
    <View
      className={clsx(styles.container)}
      style={{
        // alignItems: 'center',
        minHeight: '90vh',
      }}
    >

      {/* <View
        style={{
          gridAutoFlow: 'column',
          gap: 20,
          overflow: 'auto',
          width: '100vw',
        }}
      >
        {colors.map((color, i) => (
          <View
            key={i}
            style={{
              borderRadius: 20,
              backgroundColor: color,
              height: 42,
              width: '30vw',
            }}
          />
        ))}
      </View> */}

      <MeshVisualizer
        landmarks={landmarks}
        connections={POSE_CONNECTIONS}
      />

      {/* <CameraDisplay
        className={styles.floatingCameraDisplay}
        displayMode={CameraDisplayMode.MESH_ONLY}
        videoCamera={videoCamera!}
        bodyPoseAnalyzer={bodyPoseAnalyzer!}
        style={{ left: 0 }}
      /> */}

    </View>
  )

}
