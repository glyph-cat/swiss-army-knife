import { createLinearEquation } from '.'

describe(createLinearEquation.name, (): void => {

  // KIV: Not giving an (rationally) expected output
  // test('temp', (): void => {
  //   const f = createLinearEquation(20, 5, 2750, 0)
  //   for (let x = 5; x <= 20; x++) {
  //     const y = f(x)
  //     console.log(`x = ${x}, y = ${y}`)
  //   }
  //   expect('').toBe('')
  // })

  test('2 points', (): void => {
    const f = createLinearEquation(3, 5, 7, 9)
    const x = 42
    const y = f(x)
    expect(y).toBe(44)
  })

  test('1 point, 1 gradient', (): void => {
    const f = createLinearEquation(3, 5, 1.5)
    const x = 42
    const y = f(x)
    expect(y).toBe(63.5)
  })

})
