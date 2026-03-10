import { isDivisibleBy, isDivisibleByN, isEven, isOdd } from '.'

test(isEven.name, () => {
  expect(isEven(2)).toBeTrue()
  expect(isEven(1)).toBeFalse()
})

test(isOdd.name, () => {
  expect(isOdd(1)).toBeTrue()
  expect(isOdd(2)).toBeFalse()
})

test(isDivisibleBy.name, () => {
  expect(isDivisibleBy(5, 10)).toBeTrue()
  expect(isDivisibleBy(5, 11)).toBeFalse()
})

test(isDivisibleByN.name, () => {
  const isDivisibleBy5 = isDivisibleByN(5)
  expect(isDivisibleBy5(10)).toBeTrue()
  expect(isDivisibleBy5(11)).toBeFalse()
})
