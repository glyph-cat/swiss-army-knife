import { TestProbe, TestProbeContext } from '@glyph-cat/react-test-utils'
import { Watcher } from '@glyph-cat/swiss-army-knife'
import { render, RenderResult } from '@testing-library/react'
import { act, ReactNode, useEffect, useState } from 'react'
import { renderToString } from 'react-dom/server'
import { ClientOnly } from '.'

let renderResult: RenderResult = null!
afterEach(() => {
  renderResult?.unmount()
  renderResult = null!
})

let testProbe: TestProbe = null!
beforeEach(() => { testProbe = new TestProbe() })
afterEach(() => { testProbe = null! })

let watcher: Watcher<[]>
afterEach(() => { watcher?.dispose() })

function App(): ReactNode {
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

    function FirstLevel(): ReactNode {
      const [hasDelayed, setDelayState] = useState(false)
      useEffect(() => {
        return watcher.watch(() => { setDelayState(true) })
      }, [])
      return hasDelayed && <ClientOnly />
    }

    act(() => {
      renderResult = render(
        <ClientOnly>
          <TestProbeContext value={testProbe}>
            <FirstLevel />
          </TestProbeContext>
        </ClientOnly>
      )
    })
    expect(testProbe.getRenderCount(ClientOnly)).toBeNull()

    act(() => { watcher.post() })
    expect(testProbe.getRenderCount(ClientOnly)).toBe(1)

  })

})
