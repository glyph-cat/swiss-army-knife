import { APPLE_PLATFORM_REGEX } from '.'

test('APPLE_PLATFORM_REGEX', () => {
  expect(APPLE_PLATFORM_REGEX.test('iOS')).toBeTrue()
  expect(APPLE_PLATFORM_REGEX.test('iPhone')).toBeTrue()
  expect(APPLE_PLATFORM_REGEX.test('iPad')).toBeTrue()
  expect(APPLE_PLATFORM_REGEX.test('visionOS')).toBeTrue()
  expect(APPLE_PLATFORM_REGEX.test('xrOS')).toBeTrue()
  expect(APPLE_PLATFORM_REGEX.test('macOS')).toBeTrue()
})
