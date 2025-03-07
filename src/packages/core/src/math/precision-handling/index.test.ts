import { MathFactory } from '.'

test(MathFactory.prototype.add.name, () => {
  expect(new MathFactory(1).add(0.1, 0.2)).toBe(0.3) // instead of 0.30000000000000004
  expect(new MathFactory(1).add(0.1, 0.1, 0.1)).toBe(0.3) // instead of 0.30000000000000004
  expect(new MathFactory(2).add(0.1, 0.19)).toBe(0.29) // instead of 0.29000000000000004
  expect(new MathFactory(5).add(1, 0.1, 1, 0.1, 1, 0.1)).toBe(3.3) // multi-param stress test
})

test(MathFactory.prototype.subtract.name, () => {
  expect(new MathFactory(1).subtract(0.3, 0.1)).toBe(0.2) // instead of 0.19999999999999998
  expect(new MathFactory(1).subtract(0.4, 0.3, 0.1)).toBe(0) // instead of 2.7755575615628914e-17
  expect(new MathFactory(2).subtract(0.29, 0.1)).toBe(0.19) // instead of 0.18999999999999997
  expect(new MathFactory(5).subtract(1, 0.01, 0.02, 0.03, 0.04, 0.05)).toBe(0.85) // multi-param stress test
})

test(MathFactory.prototype.multiply.name, () => {
  expect(new MathFactory(1).multiply(0.1, 0.1)).toBe(0) // but this is because of rounding
  expect(new MathFactory(2).multiply(0.1, 0.1)).toBe(0.01) // instead of 0.010000000000000002
  expect(new MathFactory(2).multiply(0.1, 0.19)).toBe(0.02) // instead of 0.019000000000000003
  expect(new MathFactory(3).multiply(0.1, 0.19)).toBe(0.019) // instead of 0.019000000000000003
  expect(new MathFactory(3).multiply(0.1, 0.3, 0.7)).toBe(0.021) // instead of 0.020999999999999998
  expect(new MathFactory(3).multiply(0.1, 3, 0.7, 2, 0.5, 0.1)).toBe(0.021) // multi-param stress test
})

test(MathFactory.prototype.divide.name, () => {
  expect(new MathFactory(1).divide(0.3, 0.2)).toBe(1.5) // instead of 1.4999999999999998
  expect(new MathFactory(2).divide(0.07, 0.01)).toBe(7) // instead of 7.000000000000001
  expect(new MathFactory(3).divide(0.07, 0.01)).toBe(7) // 3dp should not affect the result
  expect(new MathFactory(3).divide(0.6, 2, 0.4)).toBe(0.75) // instead of 0.7499999999999999
  expect(new MathFactory(3).divide(100, 2, 5, 10, 0.5, 0.4)).toBe(5) // multi-param stress test
})
