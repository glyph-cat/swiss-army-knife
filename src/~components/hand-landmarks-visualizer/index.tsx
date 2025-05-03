import { HAND_CONNECTIONS, HandPoseLandmark } from '@glyph-cat/ml-helpers'
import { createEnumToStringConverter } from '@glyph-cat/swiss-army-knife'
import { View } from '@glyph-cat/swiss-army-knife-react'
import { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { Line, OrbitControls } from '@react-three/drei'
import { Canvas, } from '@react-three/fiber'
import { JSX, useLayoutEffect, useRef } from 'react'
import { OrbitControls as OrbitControlsRefHandle } from 'three-stdlib'
import styles from './index.module.css'

const SCALE_FACTOR_X = 15
const SCALE_FACTOR_Y = -15
const SCALE_FACTOR_Z = -40

const THUMB_FINGER_PATTERN = /^THUMB_/
const INDEX_FINGER_PATTERN = /^INDEX_/
const MIDDLE_FINGER_PATTERN = /^MIDDLE_/
const RING_FINGER_PATTERN = /^RING_/
const PINKY_FINGER_PATTERN = /^PINKY_/

const stringifyHandPoseLandmark = createEnumToStringConverter(HandPoseLandmark)

function connectionMatches(connection: [number, number], pattern: RegExp): boolean {
  const [startKey, endKey] = connection
  return pattern.test(stringifyHandPoseLandmark(startKey)) && pattern.test(stringifyHandPoseLandmark(endKey))
}

export interface HandLandmarksVisualizerProps {
  landmarks: Array<NormalizedLandmark>
}

export function HandLandmarksVisualizer({
  landmarks,
}: HandLandmarksVisualizerProps): JSX.Element {

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

        <OrbitControls
          ref={orbitControlsRef}
          enabled={true}
          enableDamping={false}
          enablePan={true}
          enableZoom={false}
        />

        {!!offsettedLandmarks && <mesh>
          {HAND_CONNECTIONS.map((connection, index) => {
            const [startKey, endKey] = connection
            let color = '#ffffff'
            if (connectionMatches(connection, THUMB_FINGER_PATTERN)) {
              color = '#ff6666'
            } else if (connectionMatches(connection, INDEX_FINGER_PATTERN)) {
              color = '#ffaa2b'
            } else if (connectionMatches(connection, MIDDLE_FINGER_PATTERN)) {
              color = '#66b566'
            } else if (connectionMatches(connection, RING_FINGER_PATTERN)) {
              color = '#2bccff'
            } else if (connectionMatches(connection, PINKY_FINGER_PATTERN)) {
              color = '#aa66ff'
            }
            const startLandmark = offsettedLandmarks[startKey]
            const endLandmark = offsettedLandmarks[endKey]
            if (!startLandmark || !endLandmark) { return null }
            return (
              <Line
                key={index}
                color={color}
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
        </mesh>}

      </Canvas>
    </View>
  )
}
