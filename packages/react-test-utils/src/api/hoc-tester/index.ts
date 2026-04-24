import { CleanupManager } from '@glyph-cat/cleanup-manager'
import { render, RenderResult } from '@testing-library/react'
import {
  act,
  ComponentType,
  createElement,
  ErrorInfo,
  Fragment,
  JSX,
  Component as ReactComponent,
  StrictMode,
} from 'react'
import { hasProperty } from '../../../../core/src/data/object/property'
import { ICapturedError } from '../../abstractions'
import { ActionNotExistError, ValueNotExistError } from '../../errors'
import { ErrorBoundary } from '../../internals'

/**
 * @public
 */
export interface HOCTesterConfig<Actions extends Record<string, (props: any) => void>, Values extends Record<string, (hocData: ReturnType<any>) => string>> {
  factory(component: ComponentType<any>): ComponentType<any>
  actions?: Actions
  /**
   * @deprecated Please use `get` instead.
   */
  values?: Values
  get?: Values
  strictMode?: boolean
}

/**
 * @public
 */
export class HOCTester<Actions extends Record<string, (props: any) => void>, Values extends Record<string, (hocData: ReturnType<any>) => string>> {

  /**
   * @internal
   */
  private readonly M$actions: Actions

  /**
   * @internal
   */
  private readonly M$values: Values

  /**
   * @internal
   */
  private M$renderResult!: RenderResult

  /**
   * @internal
   */
  private M$dispatchableActions: Partial<Record<keyof Actions, (() => void | Promise<void>)>> = {}

  /**
   * @internal
   */
  private M$retrievableValues: Partial<Record<keyof Values, {
    value: ReturnType<Values[keyof Values]>
    error?: never
  } | {
    value?: never
    error: unknown
  }>> = {}

  /**
   * @internal
   */
  private M$renderCount = 0
  get renderCount(): number { return this.M$renderCount }

  /**
   * @internal
   */
  readonly M$capturedErrors: Array<ICapturedError> = []
  get capturedErrors(): Readonly<Array<ICapturedError>> { return this.M$capturedErrors }

  constructor(
    config: HOCTesterConfig<Actions, Values>,
    cleanupManager: CleanupManager
  ) {

    this.onError = this.onError.bind(this)
    this.action = this.action.bind(this)
    this.actionAsync = this.actionAsync.bind(this)
    this.get = this.get.bind(this)
    this.dispose = this.dispose.bind(this)

    const {
      factory,
      actions,
      values: UNSAFE_values,
      get: NEW_values,
      strictMode,
    } = config
    this.M$actions = { ...actions } as Actions
    if (UNSAFE_values) {
      console.warn('The `values` property will be removed soon, please use `get` instead')
    }
    const values = { ...UNSAFE_values, ...NEW_values } // TEMP
    this.M$values = { ...values } as Values

    if (cleanupManager) { cleanupManager.append(this.dispose) }

    const ContainerComponent = this.createContainerComponent(this)
    const WrappedComponent = factory(ContainerComponent)

    act(() => {
      this.M$renderResult = render(
        createElement(
          strictMode ? StrictMode : Fragment,
          {},
          createElement(ErrorBoundary, {
            onError: this.onError,
          }, createElement(WrappedComponent))
        )
      )
    })

  }

  /**
   * This is so that we may have access to the tester class.
   * @internal
   */
  private createContainerComponent(tester: typeof this) {
    return class ContainerComponent extends ReactComponent {

      render(): JSX.Element {

        tester.M$dispatchableActions = {}
        for (const actionKey in tester.M$actions) {
          const actionCallback = tester.M$actions[actionKey]
          tester.M$dispatchableActions[actionKey] = () => actionCallback(this.props)
        }

        tester.M$retrievableValues = {}
        for (const valueKey in tester.M$values) {
          const valueMapper = tester.M$values[valueKey]
          try {
            const mappedValue = valueMapper(this.props) as ReturnType<Values[keyof Values]>
            tester.M$retrievableValues[valueKey] = { value: mappedValue }
          } catch (error) {
            // Error should not be thrown while rendering component, it should be stored
            // then thrown only when attempting to get the value. Otherwise, value will
            // not be added to `M$retrievableValues` causing `ValueNotExistError` to be
            // reported instead.
            tester.M$retrievableValues[valueKey] = { error: error }
          }
        }

        return null!
      }

      componentDidMount(): void {
        tester.M$renderCount += 1
      }

      componentDidUpdate(): void {
        tester.M$renderCount += 1
      }

    }
  }

  action(...actionKeys: Array<keyof Actions>): number {
    const previousRenderCount = this.M$renderCount
    act((): void => {
      for (const actionKey of actionKeys) {
        if (hasProperty(this.M$dispatchableActions, actionKey)) {
          this.M$dispatchableActions[actionKey]!()
        } else {
          throw new ActionNotExistError(actionKey, Object.keys(this.M$dispatchableActions))
        }
      }
    })
    return this.M$renderCount - previousRenderCount
  }

  async actionAsync(...actionKeys: Array<keyof Actions>): Promise<number> {
    const previousRenderCount = this.M$renderCount
    await act(async (): Promise<void> => {
      for (const actionKey of actionKeys) {
        if (hasProperty(this.M$dispatchableActions, actionKey)) {
          await this.M$dispatchableActions[actionKey]!()
        } else {
          throw new ActionNotExistError(actionKey, Object.keys(this.M$dispatchableActions))
        }
      }
    })
    return this.M$renderCount - previousRenderCount
  }

  get(valueKey: keyof Values): ReturnType<Values[keyof Values]> {
    if (hasProperty(this.M$retrievableValues, valueKey)) {
      const retrievedValue = this.M$retrievableValues[valueKey]
      if (hasProperty(retrievedValue, 'error')) {
        throw retrievedValue.error
      } else {
        return retrievedValue!.value!
      }
    } else {
      throw new ValueNotExistError(valueKey, Object.keys(this.M$retrievableValues))
    }
  }

  dispose(): void {
    this.M$renderResult?.unmount()
  }

  /**
   * @internal
   */
  private onError(error: Error, errorInfo: ErrorInfo): void {
    this.M$capturedErrors.push({ error, errorInfo })
  }

}
