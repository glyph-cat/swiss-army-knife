import { rot13 } from '.'

test(rot13.name, (): void => {
  const output = rot13('Hello, world!')
  expect(output).toBe('Uryyb, jbeyq!')
})
