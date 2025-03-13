import { RenderResult, render } from '@testing-library/react'
import { JSX, act } from 'react'
import { renderToString } from 'react-dom/server'
import { ClientOnly } from '.'

let renderResult: RenderResult
afterEach(() => { renderResult?.unmount() })

function App(): JSX.Element {
  return (
    <>
      <>Hello, world!</>
      <ClientOnly>
        <>Lorem ipsum</>
      </ClientOnly>
    </>
  )
}

test('Server-side', () => {
  const output = renderToString(<App />)
  expect(output).toBe('Hello, world!')
})

test('Client-side', () => {
  act(() => { renderResult = render(<App />) })
  expect(renderResult.container.textContent).toBe('Hello, world!Lorem ipsum')
})
