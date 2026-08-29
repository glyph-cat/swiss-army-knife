import { render, screen } from '@testing-library/react'
import { Portal } from '.'

const HELLO_WORLD = 'Hello, World!'

test('Happy path', () => {
  render(<Portal><h1>{HELLO_WORLD}</h1></Portal>)
  const targetElement = screen.getByRole('heading', { level: 1 })
  expect(targetElement).toBeInTheDocument()
  expect(targetElement).toHaveTextContent(HELLO_WORLD)
})

test('Custom container', () => {
  const customContainerElement = document.createElement('pre')
  document.body.append(customContainerElement)
  render(
    <Portal container={customContainerElement}>
      <code>{HELLO_WORLD}</code>
    </Portal>
  )
  const targetElement = screen.getByRole('code')
  expect(targetElement).toHaveTextContent(HELLO_WORLD)
  expect(Object.is(targetElement.parentElement, customContainerElement)).toBeTrue()
})
