import {
  getDistance2D,
  getDistance2DByCoordinates,
  getDistance3D,
  getDistance3DByCoordinate,
  reflect1D,
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

test(getDistance3D.name, () => {
  expect(getDistance3D(0, 0, 0, 4, 3, 0)).toBe(5)
})

test(getDistance3DByCoordinate.name, () => {
  expect(getDistance3DByCoordinate(
    { x: 0, y: 0, z: 0 },
    { x: 4, y: 3, z: 0 },
  )).toBe(5)
})

describe(reflect1D.name, () => {

  test('Positive only', () => {
    expect(reflect1D(5, 10)).toBe(15)
  })

  test('Negative only', () => {
    expect(reflect1D(-15, -10)).toBe(-5)
  })

  test('Negative <-> positive', () => {
    expect(reflect1D(-20, 10)).toBe(40)
  })

})
