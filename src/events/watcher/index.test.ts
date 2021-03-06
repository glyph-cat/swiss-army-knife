import { Watcher } from '.'

test(Watcher.name, (): void => {
  const watcher = new Watcher<[number]>()

  let counter = 0
  const stopWatching = watcher.watch((num: number): void => {
    counter += num
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

})
