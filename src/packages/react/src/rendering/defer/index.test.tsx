import { Nullable } from '@glyph-cat/foundation'
import { ComponentTester, useComponentTesterProbe } from '@glyph-cat/react-test-utils'
import { act, JSX } from 'react'
import { renderToString } from 'react-dom/server'
import { DeferRendering } from '.'

let componentTester: Nullable<ComponentTester> = null
afterEach(() => {
  componentTester?.dispose()
  componentTester = null
})

function App(): JSX.Element {
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
  const output = renderToString(<App />)
  expect(output).toBe('A')
})

test('Client-side rendering', () => {
  componentTester = new ComponentTester(App)
  act(() => { componentTester.render() })
  expect(componentTester.renderResult.container.textContent).toBe('AB')
  expect(componentTester.renderCount).toBe(2) // TOFIX: because <DeferRendering> itself is not probed
})
