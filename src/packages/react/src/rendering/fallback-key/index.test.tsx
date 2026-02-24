import { ReactElement, ReactNode } from 'react'
import { withFallbackRenderKey } from '.'

const FALLBACK_KEY = 'XYZ'

describe('Is valid element', () => {

  test('Already has key', () => {
    const originalNode: ReactNode = <li key='abc'>item</li>
    const output = withFallbackRenderKey(originalNode, FALLBACK_KEY)
    expect(originalNode.key).toBe('abc')
    expect(output.key).toBe('abc')
  })

  test('Does not have key yet', () => {
    const originalNode: ReactNode = <li>item</li>
    const output = withFallbackRenderKey(originalNode, FALLBACK_KEY)
    expect(originalNode.key).toBeNull()
    expect(output.key).toBe(FALLBACK_KEY)
  })

})

test('Is not valid element', () => {
  const output = withFallbackRenderKey(42, FALLBACK_KEY) as ReactNode as ReactElement
  expect(output.key).toBeUndefined()
})
