import { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { ReactNode } from 'react'
import { FaceMeshVisualizer } from '~components/facemesh-visualizer'
import landmark from './landmark-sample.json'

const points: Array<NormalizedLandmark> = landmark.map((point) => {
  return {
    ...point,
    y: (-1 * point.y) - 1,
    z: -1 * point.z,
  }
})

export default function (): ReactNode {
  return (
    <FaceMeshVisualizer landmarks={points} />
  )
}
