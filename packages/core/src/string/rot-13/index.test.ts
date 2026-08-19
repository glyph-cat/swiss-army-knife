import { rot13 } from '.'

describe(rot13.name, (): void => {

  test('Simple', (): void => {
    const output = rot13('Hello, world!')
    // cspell:disable-next-line
    expect(output).toBe('Uryyb, jbeyq!')
  })

  test('Full', (): void => {
    const output = rot13('abcdefghijklmnopqrstuvwxyz_ABCDEFGHIJKLMNOPQRSTUVWXYZ-0123456789')
    // cspell:disable-next-line
    expect(output).toBe('nopqrstuvwxyzabcdefghijklm_NOPQRSTUVWXYZABCDEFGHIJKLM-0123456789')
  })

})
