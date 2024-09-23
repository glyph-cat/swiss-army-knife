import { degToRad, radToDeg } from '.'

test(degToRad.name, () => {
  expect(degToRad(42)).toBe(0.733038)
})

test(radToDeg.name, () => {
  expect(radToDeg(0.42)).toBe(24.06423)
})
