import { getRandomNumber } from '.'

// todo: test with negative range and mixed range

test(getRandomNumber.name, (): void => {
  for (let i = 0; i < 50; i++) {
    const output = getRandomNumber(5, 10)
    if (!(output >= 5 && output < 10)) {
      throw new Error(`[Attempt#${String(i).padStart(2, '0')}] Expected output to be >=5 && < 10, but got: ${output}.`)
    }
  }
})
