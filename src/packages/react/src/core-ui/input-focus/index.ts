import { IDisposable, RefObject, TruthRecord } from '@glyph-cat/swiss-army-knife'
import { SimpleStateManager } from 'cotton-box'
import { useSimpleStateValue } from 'cotton-box-react'
import { Ref, useCallback, useId, useImperativeHandle, useLayoutEffect, useRef } from 'react'

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
  private readonly M$IsAnyInputInFocusState = new SimpleStateManager<boolean>(false)

  get isAnyInputInFocusState(): boolean {
    return this.M$IsAnyInputInFocusState.get()
  }

  /**
   * @returns `true` if there are any <Input> components that are in focus.
   */
  readonly useCheckInputFocus = (): boolean => {
    return useSimpleStateValue(this.M$IsAnyInputInFocusState)
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

  /**
   * @internal
   */
  readonly useSharedFocusableRefHandler = <Props extends IAutoFocusableProps, T extends IFocusableElementWithEventListener>(
    props: Props,
    ref: Ref<T>
  ): RefObject<T> => {

    const { autoFocus } = props

    const componentId = useId()
    const elementRef = useRef<T>(null)
    useImperativeHandle(ref, () => elementRef.current)

    const onBlur = useCallback(() => {
      this.registerBlur(componentId)
    }, [componentId])

    useLayoutEffect(() => {
      const onFocus = () => {
        this.registerFocus(componentId)
      }
      const target = elementRef.current
      target.addEventListener('focus', onFocus)
      target.addEventListener('blur', onBlur)
      return () => {
        target.removeEventListener('focus', onFocus)
        target.removeEventListener('blur', onBlur)
      }
    }, [componentId, onBlur])

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

}
