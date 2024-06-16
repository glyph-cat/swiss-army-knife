import { shuffle } from '.'

test(shuffle.name, (): void => {
  for (let i = 0; i < 50; i++) {
    const originalArray = [1, 2, 3, 4, 5]
    const originalSnapshot = String(originalArray)
    const output = shuffle(originalArray)
    const outputSnapshot = String(output)
    if (outputSnapshot === originalSnapshot) {
      throw new Error(`[Attempt#${String(i).padStart(2, '0')}] Expected output snapshot "${outputSnapshot}" to NOT be equal to "${originalSnapshot}" but they were the same.`)
    }
  }
})

