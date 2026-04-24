import { AppUtils } from '.'
import { RuntimeStorage } from '../storage/runtime'

let mockStorage: RuntimeStorage
beforeEach(() => { mockStorage = new RuntimeStorage() })
afterEach(() => { mockStorage = null! })

test(AppUtils.prototype.createStorageKey.name, () => {
  const { createStorageKey } = new AppUtils('test')
  expect(createStorageKey('foo')).toBe('test/foo')
})

test(AppUtils.prototype.clearStorage.name, () => {

  const { createStorageKey, clearStorage } = new AppUtils('test')
  const { createStorageKey: createAltStorageKey } = new AppUtils('test2')

  const storageKeyFoo = createStorageKey('foo')
  const storageKeyBar = createStorageKey('bar')
  const storageKeyAlt = createAltStorageKey('alt')

  mockStorage.setItem(storageKeyFoo, JSON.stringify({}))
  mockStorage.setItem(storageKeyBar, JSON.stringify({}))
  mockStorage.setItem(storageKeyAlt, JSON.stringify({}))
  clearStorage(mockStorage)

  expect(mockStorage.length).toBe(1)
  expect(mockStorage.key(0)).toBe(storageKeyAlt)

})
