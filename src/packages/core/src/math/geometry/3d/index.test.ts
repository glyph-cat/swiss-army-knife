import {
  getAngleFromPointsIn3D,
  getAngleOfVectorsIn3D,
  getDistance3D,
  getDistance3DByCoordinates,
} from '.'

test(getDistance3D.name, () => {
  expect(getDistance3D(0, 0, 0, 4, 3, 0)).toBe(5)
})

test(getDistance3DByCoordinates.name, () => {
  expect(getDistance3DByCoordinates(
    { x: 0, y: 0, z: 0 },
    { x: 4, y: 3, z: 0 },
  )).toBe(5)
})

test(getAngleFromPointsIn3D.name, () => {
  throw new Error('TODO')
})

test(getAngleOfVectorsIn3D.name, () => {
  throw new Error('TODO')
})
