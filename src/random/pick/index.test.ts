import { pickRandom } from '.'

describe(pickRandom.name, (): void => {

  test('string', (): void => {
    const output = pickRandom('abcde')
    expect(output).toBe('c')
  })

  test('Array', (): void => {
    const output = pickRandom([1, 2, 3, 4, 5])
    expect(output).toBe(3)
  })

})
