import { normalizePattern } from '.'

describe('Is regular expression', () => {

  test('caseSensitive = undefined', () => {
    const pattern = /(aeiou)/
    const output = normalizePattern(pattern, undefined)
    expect(Object.is(output, pattern)).toBe(true)
    expect(String(output)).toBe('/(aeiou)/')
  })

  test('caseSensitive = false', () => {
    const pattern = /(aeiou)/
    const output = normalizePattern(pattern, false)
    expect(Object.is(output, pattern)).toBe(true)
    expect(String(output)).toBe('/(aeiou)/')
  })

  test('caseSensitive = true', () => {
    const pattern = /(aeiou)/i
    const output = normalizePattern(pattern, true)
    expect(Object.is(output, pattern)).toBe(true)
    expect(String(output)).toBe('/(aeiou)/i')
  })

})

describe('Is string', () => {

  test('caseSensitive = undefined', () => {
    expect(String(normalizePattern('aeiou', undefined))).toBe('/(aeiou)/i')
  })

  test('caseSensitive = false', () => {
    expect(String(normalizePattern('aeiou', false))).toBe('/(aeiou)/i')
  })

  test('caseSensitive = true', () => {
    expect(String(normalizePattern('aeiou', true))).toBe('/(aeiou)/')
  })

})
