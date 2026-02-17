import { AggregateWatcher, Watcher, WatcherStats } from '.'

test(Watcher.name, (): void => {
  const watcher = new Watcher<[number]>()
  expect(watcher.stats).toStrictEqual(<WatcherStats>{
    count: {
      active: 0,
      expired: 0,
    },
  })

  let counter = 0
  const stopWatching = watcher.watch((num: number): void => {
    counter += num
  })
  expect(watcher.stats).toStrictEqual(<WatcherStats>{
    count: {
      active: 1,
      expired: 0,
    },
  })

  // Refresh and expect value to be updated
  watcher.refresh(1)
  expect(counter).toBe(1)

  // Refresh again and expect value to also be updated
  watcher.refresh(2)
  expect(counter).toBe(3)

  // Stop watching and expect value to stay the same as previous checkpoint
  stopWatching()
  watcher.refresh(3)
  expect(counter).toBe(3)
  expect(watcher.stats).toStrictEqual(<WatcherStats>{
    count: {
      active: 1,
      expired: 1,
    },
  })

})

test(AggregateWatcher.name, (): void => {

  const watcherA = new Watcher<[string]>()
  const watcherB = new Watcher<[number]>()

  const aw = new AggregateWatcher<[number | string]>([watcherA, watcherB])
  expect(aw.stats).toStrictEqual(<WatcherStats>{
    count: {
      active: 0,
      expired: 0,
    },
  })

  const inputStack: Array<number | string> = []
  const stopWatching = aw.watch((input: number | string): void => {
    inputStack.push(input)
  })
  expect(aw.stats).toStrictEqual(<WatcherStats>{
    count: {
      active: 1,
      expired: 0,
    },
  })

  // Refresh watcherA
  watcherA.refresh('foo')
  expect(inputStack).toStrictEqual(['foo'])

  // Refresh watcherB
  watcherB.refresh(42)
  expect(inputStack).toStrictEqual(['foo', 42])

  // Stop watching and expect value to stay the same as previous checkpoint
  stopWatching()
  watcherA.refresh('bar')
  watcherB.refresh(100)
  expect(inputStack).toStrictEqual(['foo', 42])
  expect(aw.stats).toStrictEqual(<WatcherStats>{
    count: {
      active: 1,
      expired: 1,
    },
  })

  // Test if refresh is disallowed
  const callback = () => { aw.refresh('baz') }
  expect(callback).toThrow()

})
