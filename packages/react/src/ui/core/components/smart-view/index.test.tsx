import { render, RenderResult } from '@testing-library/react'
import { act, ReactNode } from 'react'
import { SmartView, useSmartViewContext } from '.'
import { View } from '../view'

let renderResult: RenderResult = null!
afterEach(() => {
  renderResult?.unmount()
  renderResult = null!
})

const TEST_ID = 'test-container'

test(SmartView.name, () => {

  function DepthTile(): ReactNode {
    const { level } = useSmartViewContext()
    return (
      <SmartView>{`{${level}}`}</SmartView>
    )
  }

  function TestComponent(): ReactNode {
    return (
      <View data-testid={TEST_ID}>
        <DepthTile />
        <SmartView>
          <DepthTile />
          <SmartView>
            <DepthTile />
          </SmartView>
        </SmartView>
      </View>
    )
  }

  act(() => { renderResult = render(<TestComponent />) })
  expect(renderResult.getByTestId(TEST_ID).textContent).toBe('{0}{1}{2}')

})
