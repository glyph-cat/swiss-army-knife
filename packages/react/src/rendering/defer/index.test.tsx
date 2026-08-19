import { TestProbe, TestProbeContext, useTestProbe } from '@glyph-cat/react-test-utils'
import { render, RenderResult } from '@testing-library/react'
import { act, JSX } from 'react'
import { renderToString } from 'react-dom/server'
import { DeferRendering } from '.'

let renderResult: RenderResult = null!
afterEach(() => {
  renderResult?.unmount()
  renderResult = null!
})

let testProbe: TestProbe = null!
beforeEach(() => { testProbe = new TestProbe() })
afterEach(() => { testProbe = null! })

function TestComponent(): JSX.Element {
  useTestProbe(TestComponent)
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
      <TestProbeContext value={testProbe}>
        <TestComponent />
      </TestProbeContext>
    )
  })
  expect(testProbe.getRenderCount(DeferRendering)).toBe(2)
  expect(renderResult.container.textContent).toBe('AB')
})
