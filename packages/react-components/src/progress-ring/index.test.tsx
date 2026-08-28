import { render, screen } from '@testing-library/react'
import { ProgressRing } from '.'

describe(ProgressRing.name, () => {

  test('All props default value', () => {

    render(<ProgressRing />)

    const element = screen.getByRole('progressbar')
    expect(element).toBeInstanceOf(HTMLDivElement)
    expect(element).not.toHaveAttribute('aria-valuenow')
    expect(element).not.toHaveAttribute('aria-valuemin')
    expect(element).not.toHaveAttribute('aria-valuemax')
    expect(element).toHaveAttribute('aria-busy', 'true')
    expect(element).toHaveAttribute('data-overshoot', 'false')
    expect(element).toHaveStyle({
      '--angle': '0deg',
      '--colorFg': '#808080',
      '--colorBg': 'transparent',
      '--size': '64px',
      '--thickness': '8px',
    })

    const parentElement = element.parentElement
    expect(parentElement).not.toHaveClass('view', 'viewRelative')

    // Should not have trailing cap
    expect(element.children.length).toBe(0)

  })

  test('Determinate (with children)', () => {

    const SAMPLE_TEXT = 'Sample Text'
    render(
      <ProgressRing value={37}>
        <span>{SAMPLE_TEXT}</span>
      </ProgressRing>
    )

    const element = screen.getByRole('progressbar')
    expect(element).toBeInstanceOf(HTMLDivElement)
    expect(element).toHaveAttribute('aria-valuenow', '37')
    expect(element).toHaveAttribute('aria-valuemin', '0')
    expect(element).toHaveAttribute('aria-valuemax', '100')
    expect(element).toHaveAttribute('aria-busy', 'false')
    expect(element).toHaveAttribute('data-overshoot', 'false')
    expect(element).toHaveStyle({
      '--angle': '133.2deg',
      '--colorFg': '#808080',
      '--colorBg': '#80808040',
      '--size': '64px',
      '--thickness': '8px',
    })

    const parentElement = element.parentElement
    expect(parentElement).toHaveClass('view', 'viewRelative')

    const nestedContent = element.nextElementSibling!
    expect(nestedContent).toBeInstanceOf(HTMLDivElement)
    expect(nestedContent).toHaveClass('view', 'viewAbsolute')
    expect(nestedContent.childElementCount).toBe(1)

    const children = nestedContent.children.item(0)
    expect(children).toBeInstanceOf(HTMLSpanElement)
    expect(children).toContainHTML(SAMPLE_TEXT)

    const trailingCapElement = element.children.item(0)
    expect(trailingCapElement).toBeInstanceOf(HTMLDivElement)
    expect(trailingCapElement).toHaveRole('presentation')
    expect(trailingCapElement).toHaveClass('view', 'viewAbsolute')

  })

})
