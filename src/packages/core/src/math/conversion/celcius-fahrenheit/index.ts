const OFFSET = 32

const PARTIAL_CONVERSION_FACTOR_CELSIUS_TO_FAHRENHEIT = 9 / 5

/**
 * Converts Celsius to Fahrenheit.
 * @param value - The value in Celsius.
 * @returns The value in Fahrenheit.
 * @public
 */
export function celsiusToFahrenheit(value: number): number {
  return (value * PARTIAL_CONVERSION_FACTOR_CELSIUS_TO_FAHRENHEIT) + OFFSET
}

const PARTIAL_CONVERSION_FACTOR_FAHRENHEIT_TO_CELSIUS = 5 / 9

/**
 * Converts Fahrenheit to Celsius.
 * @param value - The value in Fahrenheit.
 * @returns The value in Celsius.
 * @public
 */
export function fahrenheitToCelsius(value: number): number {
  return (value - OFFSET) * PARTIAL_CONVERSION_FACTOR_FAHRENHEIT_TO_CELSIUS
}
