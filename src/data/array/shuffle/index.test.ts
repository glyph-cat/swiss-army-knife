import { shuffle } from '.'

// NOTE: It is possible for shuffled array to be the same as the original

test(shuffle.name, (): void => {
  for (let i = 0; i < 50; i++) {
    const originalArray = [1, 2, 3, 4, 5]
    const originalSnapshot = String(originalArray)
    const output = shuffle(originalArray, true)
    const outputSnapshot = String(output)
    if (outputSnapshot === originalSnapshot) {
      throw new Error(`[Attempt#${String(i).padStart(2, '0')}] Expected output snapshot "${outputSnapshot}" to NOT be equal to "${originalSnapshot}" but they were the same.`)
    }
  }
})

