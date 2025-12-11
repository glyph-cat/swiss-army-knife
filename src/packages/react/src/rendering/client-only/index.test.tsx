import { Nullable } from '@glyph-cat/foundation'
import { RenderResult, render } from '@testing-library/react'
import { JSX, act } from 'react'
import { renderToString } from 'react-dom/server'
import { ClientOnly } from '.'

let renderResult: Nullable<RenderResult> = null
afterEach(() => {
  renderResult?.unmount()
  renderResult = null
})

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

  test.skip('Nested', () => {

    function OuterComponent(): JSX.Element {
      return (
        <ClientOnly>
          <InnerComponent />
        </ClientOnly>
      )
    }
    function InnerComponent(): JSX.Element {
      return (
        <ClientOnly>
          {'innerText'}
        </ClientOnly>
      )
    }
    // TODO: when already hydrated and new components are added, they should not wait
    expect('').toBe('')

  })

})
