import { c, degToRad } from '@glyph-cat/swiss-army-knife'
import { View } from '@glyph-cat/swiss-army-knife-react'
import { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { Box, Capsule, Line, OrbitControls, Sphere } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { JSX } from 'react'
import { DoubleSide, LineBasicMaterial, MeshStandardMaterial, PerspectiveCamera, Vector3Tuple } from 'three'
import { LineMaterial, OrbitControls as OrbitControlsRefHandle } from 'three-stdlib'
import styles from './index.module.css'

// TODO
// WHY TF IS `HAND_CONNECTIONS` undefined when import { HAND_CONNECTIONS } from '@mediapipe/hands'?????
const HAND_CONNECTIONS = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]] as Array<[start: number, end: number]>

const ReferencePointMaterial = new MeshStandardMaterial({
  color: '#ff6666',
  roughness: 0.5,
  side: DoubleSide,
})

const LandmarkMaterial = new MeshStandardMaterial({
  color: '#2b80ff',
  roughness: 0.5,
  side: DoubleSide,
})

const ConnectorMaterial = new LineBasicMaterial({
  color: '#ffffff',
  opacity: 0.65,
  side: DoubleSide,
  transparent: true,
})

const SCALE_FACTOR_X = 20
const SCALE_FACTOR_Y = -20
const SCALE_FACTOR_Z = 40

export interface HandLandmarksVisualizerProps {
  landmarks: Array<NormalizedLandmark>
}

//   (0,4) -> -2 -> (-2,2)
//   (4,8) -> -6 -> (-2,2)
//  (-4,0) -> +2 -> (-2,2)
// (-8,-4) -> +6 -> (-2,2)

function getDeltaToCenter(min: number, max: number): number {
  return min - max / 2
  // (4 - 8) / 2 = -4 / 2 = -2
  // (0 - 4 / 2 = -4 / 2 = -2
  // (-4 - 0) / 2 = -4 / 2 = -2
  // (-8 - -4) / 2 = -4 / 2 = -2
}

export function HandLandmarksVisualizer({
  landmarks,
}: HandLandmarksVisualizerProps): JSX.Element {

  const offsettedLandmarks = (() => {
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
    const xOffset = (xMin - xMax) / 2
    const yOffset = (yMin - yMax) / 2
    const zOffset = (zMin - zMax) / 2
    console.log({ xOffset, yOffset, zOffset })
    return landmarks.map<NormalizedLandmark>((landmark) => {
      return {
        visibility: landmark.visibility,
        x: (landmark.x + xOffset) * SCALE_FACTOR_X,
        y: (landmark.y + yOffset) * SCALE_FACTOR_Y,
        z: (landmark.z + zOffset) * SCALE_FACTOR_Z,
      }
    })
  })()

  return (
    <View className={styles.container}>
      <Canvas className={styles.canvas}>

        <ambientLight intensity={Math.PI} color='#808080' />
        <spotLight position={[0, 10, -5]} angle={degToRad(20)} penumbra={0} decay={0.5} intensity={Math.PI} />
        <directionalLight position={[0, 10, 5]} intensity={Math.PI} />
        <directionalLight position={[0, -10, 0]} intensity={Math.PI / 5} />

        <OrbitControls
          // camera={camera}
          enableDamping={false}
          enablePan={true}
          enabled={true}
        />

        <Sphere
          args={[0.2, 8, 8]}
          material={ReferencePointMaterial}
        />

        <mesh>
          {!!offsettedLandmarks && offsettedLandmarks.map((landmark, index) => {
            return (
              <Sphere
                key={index}
                args={[0.2, 8, 8]}
                material={LandmarkMaterial}
                position={[
                  landmark.x,
                  landmark.y,
                  landmark.z,
                ]}
              />
            )
          })}
          {HAND_CONNECTIONS.map((connection, index) => {
            if (!offsettedLandmarks) { return null }
            const [startKey, endKey] = connection
            const startLandmark = offsettedLandmarks[startKey]
            const endLandmark = offsettedLandmarks[endKey]
            if (!startLandmark || !endLandmark) { return null }
            return (
              <Line
                key={index}
                color='#ffffff'
                transparent
                opacity={0.65}
                points={[
                  [startLandmark.x, startLandmark.y, startLandmark.z],
                  [endLandmark.x, endLandmark.y, endLandmark.z,],
                ]}
              />
            )
          })}
        </mesh>

      </Canvas>
    </View>
  )
}
