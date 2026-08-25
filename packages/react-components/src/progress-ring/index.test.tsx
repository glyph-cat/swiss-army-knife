import { render, RenderResult } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ProgressRing } from '.'

let renderResult: RenderResult
afterEach(() => { renderResult?.unmount() })

describe(ProgressRing.name, () => {

  test.skip('All props default value', () => {
    renderResult = render(<ProgressRing />)
    expect('').toBe('') // TODO
  })

  test.skip('Indeterminate', () => {
    expect('').toBe('') // TODO
  })

})
