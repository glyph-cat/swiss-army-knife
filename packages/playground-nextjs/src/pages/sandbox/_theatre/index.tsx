import { Canvas, } from '@react-three/fiber'
import { getProject } from '@theatre/core'
import extension from '@theatre/r3f/dist/extension'
import studio from '@theatre/studio'
import { ReactNode, useRef, useState } from 'react'
import * as THREE from 'three'
import styles from './index.module.css'

const demoSheet = getProject('Demo Project').sheet('Demo Sheet')

if (process.env.NODE_ENV !== 'production') {
  studio.initialize()
  studio.extend(extension)
}

export default function (): ReactNode {
  return (
    <Canvas
      // style={{ backgroundColor: '#80808080', height: '100%' }}
      camera={{
        position: [5, 5, -5],
        fov: 75,
      }}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  )
}
