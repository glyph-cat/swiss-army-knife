import { render, screen } from '@testing-library/react'
import { View } from '.'

const HELLO_WORLD = 'Hello, World!'

test('Happy Path', () => {
  render(<View>{HELLO_WORLD}</View>)
  const element = screen.getByText(HELLO_WORLD)
  expect(element).toBeInstanceOf(HTMLDivElement)
  expect(element).toHaveClass('view')
})

test('Relative', () => {
  render(<View.Relative>{HELLO_WORLD}</View.Relative>)
  const element = screen.getByText(HELLO_WORLD)
  expect(element).toBeInstanceOf(HTMLDivElement)
  expect(element).toHaveClass('view', 'viewRelative')
})

test('Absolute', () => {
  render(<View.Absolute>{HELLO_WORLD}</View.Absolute>)
  const element = screen.getByText(HELLO_WORLD)
  expect(element).toBeInstanceOf(HTMLDivElement)
  expect(element).toHaveClass('view', 'viewAbsolute')
})

test('Fixed', () => {
  render(<View.Fixed>{HELLO_WORLD}</View.Fixed>)
  const element = screen.getByText(HELLO_WORLD)
  expect(element).toBeInstanceOf(HTMLDivElement)
  expect(element).toHaveClass('view', 'viewFixed')
})
