import { RenderResult, render } from '@testing-library/react'
import { ReactNode, act } from 'react'
import { ClientOnly } from './index.native'

let renderResult: RenderResult
afterEach(() => { renderResult?.unmount() })

function App(): ReactNode {
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
