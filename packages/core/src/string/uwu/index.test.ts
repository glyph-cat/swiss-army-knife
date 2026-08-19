import { uwu } from '.'

test(uwu.name, (): void => {
  const output = uwu('Hello, please be my friend.')
  // cspell:disable-next-line
  expect(output).toBe('Hewwo, pwease be my fwiend.')
})
