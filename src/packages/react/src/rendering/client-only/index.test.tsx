import { RenderResult, render } from '@testing-library/react'
import { JSX, act } from 'react'
import { renderToString } from 'react-dom/server'
import { ClientOnly } from '.'

let renderResult: RenderResult
afterEach(() => { renderResult?.unmount() })

function App(): JSX.Element {
  return (
    <>
      <>{'A'}</>
      <ClientOnly>
        <>{'B'}</>
      </ClientOnly>
    </>
  )
}

test('Server-side', () => {
  const output = renderToString(<App />)
  expect(output).toBe('A')
})

describe('Client-side', () => {

  test('Happy path', () => {
    act(() => { renderResult = render(<App />) })
    expect(renderResult.container.textContent).toBe('AB')
  })

  test('Nested', () => {
    // TODO: when already hydrated and new components are added, they should not wait
  })

})
