import { getDistance2DByCoordinates, Value3D } from '@glyph-cat/swiss-army-knife'
import type { OnePersonHandPoseAnalyzerResult } from '.'

/**
 * @public
 */
export function getHandedness(
  currentWrist: Value3D,
  leftWrist: Value3D,
  rightWrist: Value3D,
): keyof OnePersonHandPoseAnalyzerResult {
  // z-position of hand landmark can be up to `4`, which screws up the distance calculation
  // since we only care about what's being translated on screen, x and y should be enough.
  const leftWristDelta = getDistance2DByCoordinates(currentWrist, leftWrist)
  const rightWristDelta = getDistance2DByCoordinates(currentWrist, rightWrist)
  return leftWristDelta < rightWristDelta ? 'L' : 'R'
}
