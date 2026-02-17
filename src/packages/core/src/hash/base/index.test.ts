import { BaseHashFactory } from '.'

describe(BaseHashFactory.prototype.track.name, () => {

  test('Collision count', () => {
    const generator = jest.fn((collisionCount: number) => collisionCount < 2 ? '1234' : '5678')
    const hashFactory = new BaseHashFactory(generator)
    const hash1 = hashFactory.create()
    expect(hash1).toBe('1234')
    expect(generator).toHaveBeenCalledTimes(1)
    const hash2 = hashFactory.create()
    expect(hash2).toBe('5678')
    expect(generator).toHaveBeenCalledTimes(4)
    // ^ collisionCount: 0… 1… 2… -> 3 calls (then +1 from the first call for `hash1`)
  })

  test('Generator args', () => {
    const generator = jest.fn(() => String(Math.random() * 100))
    const hashFactory = new BaseHashFactory<[string, string, number]>(generator)
    hashFactory.create('foo', 'bar', 42)
    expect(generator).toHaveBeenCalledWith(0, 'foo', 'bar', 42)
  })

})

test(BaseHashFactory.prototype.track.name, () => {
  const hashFactory = new BaseHashFactory(() => '')
  expect(hashFactory.history.length).toBe(0)
  hashFactory.track('1234')
  expect(hashFactory.history).toStrictEqual(['1234'])
})

test(BaseHashFactory.prototype.untrack.name, () => {
  const hashFactory = new BaseHashFactory(() => '1234')
  const hash = hashFactory.create()
  hashFactory.untrack(hash)
  expect(hashFactory.history).toStrictEqual([])
})

test(BaseHashFactory.prototype.has.name, () => {
  const hashFactory = new BaseHashFactory(() => '1234')
  const hash = hashFactory.create()
  hashFactory.track('5678')
  expect(hashFactory.has(hash)).toBe(true)
  expect(hashFactory.has('5678')).toBe(true)
  expect(hashFactory.has('0000')).toBe(false)
})

test(BaseHashFactory.prototype.reset.name, () => {
  const hashFactory = new BaseHashFactory(() => '1234')
  hashFactory.create()
  hashFactory.track('5678')
  hashFactory.reset()
  expect(hashFactory.history.length).toBe(0)
})
