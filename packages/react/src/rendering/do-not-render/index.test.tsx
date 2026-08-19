import { RenderResult, render } from '@testing-library/react'
import { ReactNode, act } from 'react'
import { DoNotRender } from '.'

let renderResult: RenderResult
afterEach(() => { renderResult?.unmount() })

function App(): ReactNode {
  return (
    <>
      <p>Hello, world!</p>
      <DoNotRender>
        <p>
          The world is a cruel and unjust place.
          <br />
          There is no harmony in the universe.
          <br />
          The only constant is suffering.
        </p>
      </DoNotRender>
    </>
  )
}

test('Happy path', () => {
  act(() => { renderResult = render(<App />) })
  expect(renderResult.container.textContent).toBe('Hello, world!')
})
