import {
  getAngleFromPointsIn2D,
  getAngleOfVectorsIn2D,
  getDistance2D,
  getDistance2DByCoordinates,
} from '.'

test(getDistance2D.name, () => {
  //     ____________________________
  // = _/[(90 - -12)² + (180 - -60)²]
  //     _____________
  // = _/[102² + 240²]
  //     _______________
  // = _/[10404 + 57600]
  //     _______
  // = _/[68004]
  //
  // = 260.7757657452088
  expect(getDistance2D(-12, -60, 90, 180)).toBe(260.7757657452088)
})

test(getDistance2DByCoordinates.name, () => {
  const a = { x: -12, y: -60 }
  const b = { x: 90, y: 180 }
  expect(getDistance2DByCoordinates(a, b)).toBe(260.7757657452088)
})

test(getAngleFromPointsIn2D.name, () => {
  expect(getAngleFromPointsIn2D(
    { x: 4, y: 4 },
    { x: 0, y: 0 },
    { x: -4, y: 4 },
    { x: 0, y: 0 },
  )).toBe(1.5707963267948966)
})

test(getAngleOfVectorsIn2D.name, () => {
  expect(getAngleOfVectorsIn2D(
    { x: -4, y: -4 },
    { x: 4, y: -4 },
  )).toBe(1.5707963267948966)
})
