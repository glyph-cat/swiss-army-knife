import { IDisposable, NullableRefObject } from '@glyph-cat/foundation'
import { TruthRecord } from '@glyph-cat/swiss-army-knife'
import { SimpleStateManager } from 'cotton-box'
import { useSimpleStateValue } from 'cotton-box-react'
import { Ref, useCallback, useId, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import { useCoreUIContext } from '../context'

/**
 * @public
 */
export interface IAutoFocusableProps {
  autoFocus?: boolean
}

/**
 * @public
 */
export interface IFocusableElementWithEventListener {
  addEventListener(eventName: 'focus' | 'blur', handler: (event: Event) => void): void
  removeEventListener(eventName: 'focus' | 'blur', handler: (event: Event) => void): void
  focus(): void
}

/**
 * @public
 */
export class InputFocusTracker implements IDisposable {

  /**
   * @internal
   */
  private readonly M$inputFocusTracker: TruthRecord<string> = {}

  /**
   * @internal
   */
  readonly M$IsAnyInputInFocusState = new SimpleStateManager<boolean>(false)

  get isAnyInputInFocusState(): boolean {
    return this.M$IsAnyInputInFocusState.get()
  }

  registerFocus(componentId: string): void {
    this.M$inputFocusTracker[componentId] = true
    this.M$refreshState()
  }

  registerBlur(componentId: string): void {
    delete this.M$inputFocusTracker[componentId]
    this.M$refreshState()
  }

  dispose(): void {
    this.M$IsAnyInputInFocusState.dispose()
  }

  /**
   * @internal
   */
  private M$refreshState(): void {
    this.M$IsAnyInputInFocusState.set(Object.keys(this.M$inputFocusTracker).length > 0)
  }

}

/**
 * @returns `true` if there are any <Input> components that are in focus.
 * @public
 */
export function useCheckInputFocus(): boolean {
  const { inputFocusTracker } = useCoreUIContext()
  if (!inputFocusTracker) {
    throw new Error('`useCheckInputFocus` requires `inputFocusTracker` to be provided in <CoreUIContext>')
  }
  return useSimpleStateValue(inputFocusTracker.M$IsAnyInputInFocusState)
}

/**
 * @public
 */
export function useCommonFocusableRefHandler<Props extends IAutoFocusableProps, T extends IFocusableElementWithEventListener>({
  autoFocus,
}: Props, ref: Ref<T>): NullableRefObject<T> {

  const { inputFocusTracker } = useCoreUIContext()
  if (!inputFocusTracker) {
    throw new Error('`useCheckInputFocus` requires `inputFocusTracker` to be provided in <CoreUIContext>')
  }
  const componentId = useId()
  const elementRef = useRef<T>(null)
  useImperativeHandle(ref, () => elementRef.current!)

  const onBlur = useCallback(() => {
    inputFocusTracker.registerBlur(componentId)
  }, [componentId, inputFocusTracker])

  useLayoutEffect(() => {
    const target = elementRef.current
    if (!target) { return }
    const onFocus = () => {
      inputFocusTracker.registerFocus(componentId)
    }
    target.addEventListener('focus', onFocus)
    target.addEventListener('blur', onBlur)
    return () => {
      target.removeEventListener('focus', onFocus)
      target.removeEventListener('blur', onBlur)
    }
  }, [componentId, inputFocusTracker, onBlur])

  const isInitialRender = useRef(true)
  useLayoutEffect(() => {
    // Else passing autofocus directly to the <input> element will not cause
    // focus listener above to be triggered
    if (autoFocus) {
      if (isInitialRender.current) {
        elementRef.current?.focus()
        isInitialRender.current = false
      }
    }
  }, [autoFocus])

  useLayoutEffect(() => {
    // Else onBlur will not be triggered when component unmounts
    return () => { onBlur() }
  }, [onBlur])

  return elementRef

}
