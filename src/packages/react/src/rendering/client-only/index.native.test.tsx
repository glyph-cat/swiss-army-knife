import { RenderResult, render } from '@testing-library/react'
import { JSX, act } from 'react'
import { ClientOnly } from './index.native'

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

test('Client-side', () => {
  act(() => { renderResult = render(<App />) })
  expect(renderResult.container.textContent).toBe('Hello, world!Lorem ipsum')
})
