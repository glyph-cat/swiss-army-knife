import { APPLE_PLATFORM_REGEX } from '.'

test('APPLE_PLATFORM_REGEX', () => {
  expect(APPLE_PLATFORM_REGEX.test('iOS')).toBe(true)
  expect(APPLE_PLATFORM_REGEX.test('iPhone')).toBe(true)
  expect(APPLE_PLATFORM_REGEX.test('iPad')).toBe(true)
  expect(APPLE_PLATFORM_REGEX.test('visionOS')).toBe(true)
  expect(APPLE_PLATFORM_REGEX.test('xrOS')).toBe(true)
  expect(APPLE_PLATFORM_REGEX.test('macOS')).toBe(true)
})
