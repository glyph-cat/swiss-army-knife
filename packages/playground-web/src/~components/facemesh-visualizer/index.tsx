import { degToRad } from '@glyph-cat/swiss-army-knife'
import { View } from '@glyph-cat/swiss-army-knife-react'
import { FaceLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision'
import {
  Billboard,
  GizmoHelper,
  GizmoViewport,
  Grid,
  Line,
  OrbitControls,
  Sphere,
  Text,
} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Fragment, JSX, Suspense, useLayoutEffect, useRef } from 'react'
import { DoubleSide, MeshStandardMaterial } from 'three'
import { OrbitControls as OrbitControlsRefHandle } from 'three-stdlib'
import styles from './index.module.css'

interface Connection {
  start: number
  end: number
}

function convertConnection(connections: Array<Connection>): Array<[start: number, end: number]> {
  const convertedConnections: Array<[start: number, end: number]> = []
  for (const connection of connections) {
    convertedConnections.push([connection.start, connection.end])
  }
  return convertedConnections
}

const FACE_LANDMARKS_TESSELATION = convertConnection(FaceLandmarker.FACE_LANDMARKS_TESSELATION)
const FACE_LANDMARKS_CONTOURS = convertConnection(FaceLandmarker.FACE_LANDMARKS_CONTOURS)
const FACE_LANDMARKS_LEFT_IRIS = convertConnection(FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS)
const FACE_LANDMARKS_RIGHT_IRIS = convertConnection(FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS)

const SCALE_FACTOR_X = 15
const SCALE_FACTOR_Y = 10
const SCALE_FACTOR_Z = 10

const pointMaterial = new MeshStandardMaterial({
  color: '#ffffff',
})

export interface FaceMeshVisualizerProps {
  landmarks: Array<NormalizedLandmark>
}

export function FaceMeshVisualizer({
  landmarks,
}: FaceMeshVisualizerProps): JSX.Element {

  const offsettedLandmarks: Array<NormalizedLandmark> = (() => {
    if (!landmarks) { return null } // Early exit
    let xMin = Number.MAX_SAFE_INTEGER
    let xMax = Number.MIN_SAFE_INTEGER
    let yMin = Number.MAX_SAFE_INTEGER
    let yMax = Number.MIN_SAFE_INTEGER
    let zMin = Number.MAX_SAFE_INTEGER
    let zMax = Number.MIN_SAFE_INTEGER
    for (const { x, y, z } of landmarks) {
      if (x < xMin) { xMin = x }
      if (x > xMax) { xMax = x }
      if (y < yMin) { yMin = y }
      if (y > yMax) { yMax = y }
      if (z < zMin) { zMin = z }
      if (z > zMax) { zMax = z }
    }
    const xOffset = (xMin + xMax) / 2
    const yOffset = (yMin + yMax) / 2
    const zOffset = (zMin + zMax) / 2
    return landmarks.map<NormalizedLandmark>((landmark) => {
      return {
        visibility: landmark.visibility,
        x: (landmark.x - xOffset) * SCALE_FACTOR_X,
        y: (landmark.y - yOffset) * SCALE_FACTOR_Y,
        z: (landmark.z - zOffset) * SCALE_FACTOR_Z,
      }
    })
  })()

  const containerRef = useRef<View>(null)
  const orbitControlsRef = useRef<OrbitControlsRefHandle>(null)
  useLayoutEffect(() => {
    const target = containerRef.current
    const onDoubleClick = () => {
      orbitControlsRef.current?.reset()
    }
    target.addEventListener('dblclick', onDoubleClick)
    return () => { target.removeEventListener('dblclick', onDoubleClick) }
  }, [])

  return (
    <View ref={containerRef} className={styles.container}>
      <Canvas className={styles.canvas}>

        <ambientLight intensity={Math.PI} color='#808080' />
        <spotLight position={[0, 10, -5]} angle={degToRad(20)} penumbra={0} decay={0.5} intensity={Math.PI} />
        <directionalLight position={[0, 10, 5]} intensity={Math.PI} />
        <directionalLight position={[0, -10, 0]} intensity={Math.PI / 5} />

        <OrbitControls
          ref={orbitControlsRef}
          enabled={true}
          enableDamping={false}
          enablePan={true}
          makeDefault
        />

        <Grid
          infiniteGrid
          sectionColor='#3c3c3c'
          side={DoubleSide}
        />

        <GizmoHelper
          alignment='bottom-right'
          margin={[50, 50]}
        >
          <GizmoViewport
            axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']}
            labelColor='#ffffff'
          />
        </GizmoHelper>

        {offsettedLandmarks && (
          <mesh>
            <ConnectionLines
              connectionSet={FACE_LANDMARKS_TESSELATION}
              offsettedLandmarks={offsettedLandmarks}
            />
            <ConnectionLines
              connectionSet={FACE_LANDMARKS_CONTOURS}
              offsettedLandmarks={offsettedLandmarks}
            />
            <ConnectionLines
              connectionSet={FACE_LANDMARKS_LEFT_IRIS}
              offsettedLandmarks={offsettedLandmarks}
            />
            <ConnectionLines
              connectionSet={FACE_LANDMARKS_RIGHT_IRIS}
              offsettedLandmarks={offsettedLandmarks}
            />
            <Suspense>
              {offsettedLandmarks.map((point, index) => {
                return (
                  <Fragment key={index}>
                    <mesh position={[point.x, point.y, point.z]}>
                      <Sphere
                        args={[0.01, 16, 16]}
                        material={pointMaterial}
                      />
                      <Billboard
                        follow={true}
                        lockX={false}
                        lockY={false}
                        lockZ={false} // Lock the rotation on the z axis (default=false)
                      >
                        <Text
                          color='#2b80ff'
                          anchorX='center'
                          anchorY='middle'
                          fontSize={0.015}
                          position={[0, 0.02, 0]}
                        >
                          {index}
                        </Text>
                      </Billboard>
                    </mesh>
                  </Fragment>
                )
              })}
            </Suspense>
          </mesh>
        )}

      </Canvas>
    </View>
  )
}

interface ConnectionLinesProps {
  offsettedLandmarks: Array<NormalizedLandmark>
  connectionSet: ReturnType<typeof convertConnection>
}

function ConnectionLines({
  offsettedLandmarks,
  connectionSet,
}: ConnectionLinesProps): JSX.Element {
  return (
    <mesh>
      {connectionSet.map((connection, index) => {
        const [startKey, endKey] = connection
        const startLandmark = offsettedLandmarks[startKey]
        const endLandmark = offsettedLandmarks[endKey]
        if (!startLandmark || !endLandmark) { return null }
        return (
          <Line
            key={index}
            color={'#ffffff'}
            transparent
            opacity={0.25}
            lineWidth={1}
            points={[
              [startLandmark.x, startLandmark.y, startLandmark.z],
              [endLandmark.x, endLandmark.y, endLandmark.z,],
            ]}
          />
        )
      })}
    </mesh>
  )
}
