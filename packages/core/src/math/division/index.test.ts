import { isDivisibleBy, isDivisibleByN, isEven, isOdd } from '.'

test(isEven.name, () => {
  expect(isEven(2)).toBe(true)
  expect(isEven(1)).toBe(false)
})

test(isOdd.name, () => {
  expect(isOdd(1)).toBe(true)
  expect(isOdd(2)).toBe(false)
})

test(isDivisibleBy.name, () => {
  expect(isDivisibleBy(5, 10)).toBe(true)
  expect(isDivisibleBy(5, 11)).toBe(false)
})

test(isDivisibleByN.name, () => {
  const isDivisibleBy5 = isDivisibleByN(5)
  expect(isDivisibleBy5(10)).toBe(true)
  expect(isDivisibleBy5(11)).toBe(false)
})
