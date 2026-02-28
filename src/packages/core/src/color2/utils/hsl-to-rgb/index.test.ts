import { hslToRgb } from '.'

test('Happy path', () => {
  // NOTE: Some precision is lost during conversion,
  // hence `41, 126, ...` instead of `43, 128, ...`
  expect(hslToRgb(216, 100, 58)).toStrictEqual([41, 126, 255])
})
