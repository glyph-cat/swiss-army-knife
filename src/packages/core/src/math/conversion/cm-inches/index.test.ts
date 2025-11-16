import { cmToInches, inchesToCm } from '.'

test(cmToInches.name, () => {
  expect(cmToInches(1)).toBe(0.39370078740157477)
})

test(inchesToCm.name, () => {
  expect(inchesToCm(1)).toBe(2.54)
})
