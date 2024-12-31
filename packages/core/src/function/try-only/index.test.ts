import { tryOnly } from '.'

test(tryOnly.name, (): void => {
  const callback = () => {
    tryOnly(() => {
      throw new Error('I am not supposed to break the test')
    })
  }
  expect(callback).not.toThrow()
})
