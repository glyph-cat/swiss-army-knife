import { render, RenderResult } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { View } from '.'

let renderResult: RenderResult
afterEach(() => { renderResult?.unmount() })

test(View.name, () => {
  renderResult = render(<View>Hello, World!</View>)
  expect(renderResult.container.tagName).toBe('DIV')
  expect(renderResult.container.textContent).toBe('Hello, World!')
  const staticMarkup = renderToStaticMarkup(<View>Hello, World!</View>)
  expect(staticMarkup).toBe('<div class="view">Hello, World!</div>')
})
