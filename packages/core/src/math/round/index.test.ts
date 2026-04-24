import { round } from '.'

describe(round.name, (): void => {

  test('Whole number rounding', (): void => {
    expect(round(42, 2)).toBe(42)
    expect(round(42.1)).toBe(42)
    expect(round(42.2)).toBe(42)
    expect(round(42.3)).toBe(42)
    expect(round(42.4)).toBe(42)
    expect(round(42.5)).toBe(43)
    expect(round(42.6)).toBe(43)
    expect(round(42.7)).toBe(43)
    expect(round(42.8)).toBe(43)
    expect(round(42.9)).toBe(43)
  })

  test('Complicated decimal rounding', (): void => {
    expect(round(42.2, 2)).toBe(42.2)
    expect(round(42.7, 2)).toBe(42.7)
    expect(round(123.451, 2)).toBe(123.45)
    expect(round(123.456, 2)).toBe(123.46)
  })

})
