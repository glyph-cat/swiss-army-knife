import { getRandomNumber } from '.'

describe(getRandomNumber.name, (): void => {

  const numberOfIterations = 50

  test('Positive range', (): void => {
    const output = new Array(numberOfIterations).map(() => getRandomNumber(5, 10))
    expect(output.every((value) => value >= 5 && value < 10)).toBeTrue()
  })

  test('Negative range', (): void => {
    const output = new Array(numberOfIterations).map(() => getRandomNumber(-10, -5))
    expect(output.every((value) => value >= -10 && value < 5)).toBeTrue()
  })

  test('Mixed range', (): void => {
    const output = new Array(numberOfIterations).map(() => getRandomNumber(-10, 15))
    expect(output.every((value) => value >= -10 && value < 15)).toBeTrue()
  })

})
