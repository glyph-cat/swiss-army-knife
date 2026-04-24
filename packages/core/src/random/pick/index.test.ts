import { pickRandom } from '.'

describe(pickRandom.name, (): void => {

  test('string', (): void => {
    const output = pickRandom('abcde')
    expect(output).toMatch(/^[abcde]$/)
  })

  test('Array', (): void => {
    const output = pickRandom([1, 2, 3, 4, 5])
    expect(output).toBeGreaterThanOrEqual(1)
    expect(output).toBeLessThanOrEqual(5)
  })

})
