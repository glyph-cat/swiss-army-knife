import { getDistance2D, reflectValueOnLine } from '.'

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

describe(reflectValueOnLine.name, () => {

  test('Positive only', () => {
    expect(reflectValueOnLine(5, 10)).toBe(15)
  })

  test('Negative only', () => {
    expect(reflectValueOnLine(-15, -10)).toBe(-5)
  })

  test('Negative <-> positive', () => {
    expect(reflectValueOnLine(-20, 10)).toBe(40)
  })

})
