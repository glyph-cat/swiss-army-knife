import { RuntimeStorage } from '.'

const TEST_KEY_1 = 'key1'
const TEST_KEY_2 = 'key2'
const TEST_VALUE_1 = 37
const TEST_VALUE_2 = { value: 42 }

let storage: RuntimeStorage = null!
beforeEach(() => {
  storage = new RuntimeStorage()
})
afterEach(() => {
  storage?.dispose()
  storage = null!
})

// TODO: `[key: string]: unknown`
// TODO: event listener - SET
// TODO: event listener - REMOVE
// TODO: event listener - CLEAR

test('Initial state', () => {
  expect(storage.length).toBe(0)
})

test('Generic use case', () => {

  storage.setItem(TEST_KEY_1, TEST_VALUE_1)
  expect(storage.getItem(TEST_KEY_1)).toBe(String(TEST_VALUE_1))
  expect(storage.length).toBe(1)
  expect(storage.key(0)).toBe(TEST_KEY_1)
  expect(storage[TEST_KEY_1]).toBe(String(TEST_VALUE_1))

  storage.setItem(TEST_KEY_2, TEST_VALUE_2)
  expect(storage.getItem(TEST_KEY_2)).toBe(JSON.stringify(TEST_VALUE_2))
  expect(storage.length).toBe(2)
  expect(storage.key(1)).toBe(TEST_KEY_2)
  expect(storage[TEST_KEY_2]).toBe(JSON.stringify(TEST_VALUE_2))

  storage.removeItem(TEST_KEY_1)
  expect(storage.getItem(TEST_KEY_1)).toBeNull()
  expect(storage.length).toBe(1)
  expect(storage.key(0)).toBe(TEST_KEY_2)
  expect(storage[TEST_KEY_1]).toBeUndefined()

  storage.removeItem(TEST_KEY_2)
  expect(storage.getItem(TEST_KEY_2)).toBeNull()
  expect(storage.length).toBe(0)
  expect(storage.key(0)).toBeNull()
  expect(storage[TEST_KEY_2]).toBeUndefined()

})

test(RuntimeStorage.prototype.clear.name, () => {
  storage.setItem(TEST_KEY_1, TEST_VALUE_1)
  storage.setItem(TEST_KEY_2, TEST_VALUE_2)
  storage.clear()
  expect(storage.length).toBe(0)
  expect(storage.getItem(TEST_KEY_1)).toBeNull()
  expect(storage.getItem(TEST_KEY_2)).toBeNull()
  expect(storage[TEST_KEY_1]).toBeUndefined()
  expect(storage[TEST_KEY_2]).toBeUndefined()
})
