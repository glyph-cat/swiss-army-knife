import { celsiusToFahrenheit, fahrenheitToCelsius } from '.'

test(celsiusToFahrenheit.name, () => {
  expect(celsiusToFahrenheit(0)).toBe(32)
  expect(celsiusToFahrenheit(30)).toBe(86)
})

test(fahrenheitToCelsius.name, () => {
  expect(fahrenheitToCelsius(32)).toBe(0)
  expect(fahrenheitToCelsius(86)).toBe(30)
})
