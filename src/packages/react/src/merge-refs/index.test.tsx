import { Empty, RefObject, StringRecord } from '@glyph-cat/foundation'
import { createRef } from '@glyph-cat/swiss-army-knife'
import { render, RenderResult } from '@testing-library/react'
import {
  act,
  ForwardedRef,
  forwardRef,
  JSX,
  useImperativeHandle,
  useRef as useRef_BASE,
} from 'react'
import { mergeRefs, useMergedRefs } from '.'

let renderResult: RenderResult
afterEach(() => { renderResult?.unmount() })

const MockComponentInstance = { onScroll: Empty.FUNCTION }

interface MockComponent {
  onScroll(): void
}

test(useMergedRefs.name, () => {

  const hookGeneratedRefs: Array<RefObject<unknown>> = []

  const useRef = jest.fn(() => {
    const newRef = useRef_BASE(null)
    hookGeneratedRefs.push(newRef)
    return newRef
  }) as typeof useRef_BASE

  const MockComponent = forwardRef(function (
    props: StringRecord,
    ref: ForwardedRef<MockComponent>,
  ): JSX.Element {
    useImperativeHandle(ref, () => MockComponentInstance, [])
    return null
  })

  const TestComponent = forwardRef(function (
    props: StringRecord,
    ref: ForwardedRef<MockComponent>,
  ): JSX.Element {
    const localRef = useRef<MockComponent>(null)
    const mergedRef = useMergedRefs(ref, localRef)
    return <MockComponent ref={mergedRef} />
  })

  const mockRef = jest.fn()
  act(() => { renderResult = render(<TestComponent ref={mockRef} />) })

  // Expect ref object to be assigned with appropriate object
  expect(hookGeneratedRefs.length).toBe(1)
  console.log('hookGeneratedRefs[0].current', hookGeneratedRefs[0].current)
  expect(Object.is(hookGeneratedRefs[0].current, MockComponentInstance)).toBe(true)

  // Expect ref function to be called with appropriate object
  expect(mockRef).toHaveBeenCalledTimes(1)
  expect(mockRef).toHaveBeenNthCalledWith(1, MockComponentInstance)

})

describe(mergeRefs.name, () => {

  test('No refs', () => {
    expect(() => {
      const mergeRefsHandler = mergeRefs()
      const cleanupRefsHandler = mergeRefsHandler(MockComponentInstance)
      cleanupRefsHandler()
    }).not.toThrow()
  })

  test('Single ref object', () => {

    const ref = createRef<MockComponent>(null)

    const mergeRefsHandler = mergeRefs(ref)

    const cleanupRefsHandler = mergeRefsHandler(MockComponentInstance)
    expect(Object.is(ref.current, MockComponentInstance)).toBe(true)

    cleanupRefsHandler()
    expect(ref.current).toBeNull()

  })

  test('Single ref function', () => {

    const ref = jest.fn()

    const mergeRefsHandler = mergeRefs(ref)

    const cleanupRefsHandler = mergeRefsHandler(MockComponentInstance)
    expect(ref).toHaveBeenCalledTimes(1)
    expect(ref).toHaveBeenNthCalledWith(1, MockComponentInstance)

    cleanupRefsHandler()
    expect(ref).toHaveBeenCalledTimes(2)
    expect(ref).toHaveBeenNthCalledWith(2, null)

  })

  test('Combined', () => {

    const refObject1 = createRef<MockComponent>(null)
    const refObject2 = createRef<MockComponent>(null)
    const refFunction1 = jest.fn()
    const refFunction2 = jest.fn()

    const mergeRefsHandler = mergeRefs(refObject1, refFunction1, refObject2, refFunction2)

    const cleanupRefsHandler = mergeRefsHandler(MockComponentInstance)
    expect(Object.is(refObject1.current, MockComponentInstance)).toBe(true)
    expect(Object.is(refObject2.current, MockComponentInstance)).toBe(true)
    expect(refFunction1).toHaveBeenCalledTimes(1)
    expect(refFunction2).toHaveBeenCalledTimes(1)
    expect(refFunction1).toHaveBeenNthCalledWith(1, MockComponentInstance)
    expect(refFunction2).toHaveBeenNthCalledWith(1, MockComponentInstance)

    cleanupRefsHandler()
    expect(refObject1.current).toBeNull()
    expect(refObject2.current).toBeNull()
    expect(refFunction1).toHaveBeenCalledTimes(2)
    expect(refFunction2).toHaveBeenCalledTimes(2)
    expect(refFunction1).toHaveBeenNthCalledWith(2, null)
    expect(refFunction2).toHaveBeenNthCalledWith(2, null)

  })

})
