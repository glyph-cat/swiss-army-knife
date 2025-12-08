import { tryOnly } from '.'

class CustomTestError extends Error {

  readonly message = 'I am not supposed to break the test'

}

describe('Synchronous', () => {

  describe('No error', () => {

    test('Generic use case', () => {
      const callback = () => {
        tryOnly(() => { /* ... */ })
      }
      expect(callback).not.toThrow()
    })

    test('Executes synchronously', () => {
      expect(tryOnly(() => { /* ... */ })).toBeUndefined()
    })

  })

  describe('Contains error', () => {

    test('Generic use case', () => {
      const callback = () => {
        tryOnly(() => {
          throw new CustomTestError()
        })
      }
      expect(callback).not.toThrow()
    })

    test('Executes synchronously', () => {
      expect(tryOnly(() => {
        throw new CustomTestError()
      })).toBeUndefined()
    })

  })

})

describe('Asynchronous', () => {

  describe('No error', () => {

    test('Generic use case', async () => {
      const callback = async () => {
        await tryOnly(async () => { /* ... */ })
      }
      await expect(callback).resolves.not.toThrow()
    })

    test('Executes asynchronously', async () => {
      await expect(tryOnly(async () => { /* ... */ })).resolves.toBeUndefined()
    })

  })

  describe('Contains error', () => {

    test('Generic use case', async () => {
      const callback = async () => {
        await tryOnly(async () => {
          throw new CustomTestError()
        })
      }
      await expect(callback).resolves.not.toThrow()
    })

    test('Executes asynchronously', async () => {
      await expect(tryOnly(async () => {
        throw new CustomTestError()
      })).resolves.toBeUndefined()
    })

  })

})
