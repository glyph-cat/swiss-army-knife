import { Nullable } from '@glyph-cat/foundation'
import { TestProbe, TestProbeProvider } from '@glyph-cat/react-test-utils'
import { RenderResult, render } from '@testing-library/react'
import { Watcher } from 'cotton-box'
import { JSX, act, useEffect, useState } from 'react'
import { renderToString } from 'react-dom/server'
import { ClientOnly } from '.'

let renderResult: Nullable<RenderResult> = null
afterEach(() => {
  renderResult?.unmount()
  renderResult = null
})

let testProbe: Nullable<TestProbe> = null
beforeEach(() => { testProbe = new TestProbe() })
afterEach(() => { testProbe = null })

let watcher: Watcher<[]>
afterEach(() => { watcher?.dispose() })

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

    watcher = new Watcher<[]>()

    function FirstLevel(): JSX.Element {
      const [hasDelayed, setDelayState] = useState(false)
      useEffect(() => {
        return watcher.watch(() => { setDelayState(true) })
      }, [])
      return hasDelayed && <ClientOnly />
    }

    act(() => {
      renderResult = render(
        <ClientOnly>
          <TestProbeProvider value={testProbe}>
            <FirstLevel />
          </TestProbeProvider>
        </ClientOnly>
      )
    })
    expect(testProbe.getRenderCount(ClientOnly.name)).toBeNull()

    act(() => { watcher.refresh() })
    expect(testProbe.getRenderCount(ClientOnly.name)).toBe(1)

  })

})
