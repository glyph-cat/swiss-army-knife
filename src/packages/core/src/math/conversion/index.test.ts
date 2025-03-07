import { degToRad, radToDeg } from '.'

test(degToRad.name, () => {
  expect(degToRad(42)).toBe(0.7330382858376184)
})

test(radToDeg.name, () => {
  expect(radToDeg(0.42)).toBe(24.064227395494576)
})
