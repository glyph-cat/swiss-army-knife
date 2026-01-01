import { Nullable } from '@glyph-cat/foundation'
import {
  TestProbe,
  TestProbeProvider,
  useComponentTesterProbe,
} from '@glyph-cat/react-test-utils'
import { render, RenderResult } from '@testing-library/react'
import { act, JSX } from 'react'
import { renderToString } from 'react-dom/server'
import { DeferRendering } from '.'

let renderResult: Nullable<RenderResult> = null
afterEach(() => {
  renderResult?.unmount()
  renderResult = null
})

let testProbe: Nullable<TestProbe> = null
beforeEach(() => { testProbe = new TestProbe() })
afterEach(() => { testProbe = null })

function TestComponent(): JSX.Element {
  useComponentTesterProbe()
  return (
    <>
      {'A'}
      <DeferRendering>
        {'B'}
      </DeferRendering>
    </>
  )
}

test('Server-side rendering', () => {
  const output = renderToString(<TestComponent />)
  expect(output).toBe('A')
})

test('Client-side rendering', () => {
  act(() => {
    renderResult = render(
      <TestProbeProvider value={testProbe}>
        <TestComponent />
      </TestProbeProvider>
    )
  })
  expect(testProbe.getRenderCount(DeferRendering.name)).toBe(2)
  expect(renderResult.container.textContent).toBe('AB')
})
