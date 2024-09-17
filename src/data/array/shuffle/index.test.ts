import { shuffle } from '.'

// NOTE: It is possible for shuffled array to be the same as the original.
// So here, we are only testing when `strict = true`.

test(shuffle.name, (): void => {
  for (let i = 0; i < 50; i++) {
    const originalArray = [1, 2, 3, 4, 5]
    const originalSnapshot = String(originalArray)
    const output = shuffle(originalArray, true)
    const outputSnapshot = String(output)
    const snapshotEquality = outputSnapshot === originalSnapshot
    if (snapshotEquality) {
      // eslint-disable-next-line no-console
      console.error(`[Attempt#${String(i).padStart(2, '0')}] Expected output snapshot "${outputSnapshot}" to NOT be equal to "${originalSnapshot}" but they were the same.`)
    }
    expect(snapshotEquality).toBe(false)
  }
})
