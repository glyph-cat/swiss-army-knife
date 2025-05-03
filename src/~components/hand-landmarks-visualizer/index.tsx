import { HAND_CONNECTIONS } from '@glyph-cat/ml-helpers'
import { degToRad } from '@glyph-cat/swiss-army-knife'
import { View } from '@glyph-cat/swiss-army-knife-react'
import { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { Line, OrbitControls, Sphere } from '@react-three/drei'
import { Canvas, } from '@react-three/fiber'
import { JSX, useLayoutEffect, useRef } from 'react'
import { DoubleSide, MeshStandardMaterial } from 'three'
import { OrbitControls as OrbitControlsRefHandle } from 'three-stdlib'
import styles from './index.module.css'

const LandmarkMaterial = new MeshStandardMaterial({
  color: '#2b80ff',
  roughness: 0.5,
  side: DoubleSide,
})

const SCALE_FACTOR_X = 15
const SCALE_FACTOR_Y = -15
const SCALE_FACTOR_Z = -40

export interface HandLandmarksVisualizerProps {
  landmarks: Array<NormalizedLandmark>
}

export function HandLandmarksVisualizer({
  landmarks,
}: HandLandmarksVisualizerProps): JSX.Element {

  const offsettedLandmarks = (() => {
    let xMin = Number.MAX_SAFE_INTEGER
    let xMax = Number.MIN_SAFE_INTEGER
    let yMin = Number.MAX_SAFE_INTEGER
    let yMax = Number.MIN_SAFE_INTEGER
    let zMin = Number.MAX_SAFE_INTEGER
    let zMax = Number.MIN_SAFE_INTEGER
    if (landmarks) {
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
    }
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
          enableDamping={false}
          enablePan={true}
          enabled={true}
        />

        <mesh>
          {!!offsettedLandmarks && offsettedLandmarks.map((landmark, index) => {
            return (
              <Sphere
                key={index}
                args={[0.1, 8, 8]}
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
                opacity={0.5}
                lineWidth={5}
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
