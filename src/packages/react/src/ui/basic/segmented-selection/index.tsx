import { injectInlineCSSVariables } from '@glyph-cat/css-utils'
import { LenientString } from '@glyph-cat/foundation'
import { isBoolean } from '@glyph-cat/type-checking'
import {
  Children,
  createContext,
  Fragment,
  JSX,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useThemeContext } from '../../../styling'
import { View } from '../../core/components/view'
import { tryResolvePaletteColor } from '../_internals/try-resolve-palette-color'
import { BasicUIColor, BasicUISize } from '../abstractions'
import { BasicButton } from '../button'
import { __OVERRIDE_TINT as __TINT } from '../constants'
import {
  DATA_ADJACENT_ITEM_IS_SELECTED,
  DATA_DISABLED,
  DATA_SELECTED_ITEM_IS_DISABLED,
  styles,
} from './styles'

interface ISegmentedSelectionContext<Value> {
  value: Value
  onChange(value: Value): void
  size: BasicUISize
  disabled: boolean
}

const SegmentedSelectionContext = createContext<ISegmentedSelectionContext<unknown>>(null)

/**
 * @public
 */
export interface SegmentedSelectionProps<Value> {
  value: Value
  onChange(value: Value): void
  children?: ReactNode
  /**
   * @defaultValue `false`
   */
  disabled?: boolean
  /**
   * @defaultValue `'m'`
   */
  size?: BasicUISize
  /**
   * @defaultValue `'primary'`
   */
  color?: LenientString<BasicUIColor>
}

// TODO: Consider using label and input and `display: none;` for the input?

/**
 * @public
 */
export function SegmentedSelection<Value>({
  value,
  onChange,
  children,
  disabled,
  size,
  color: $color,
}: SegmentedSelectionProps<Value>): JSX.Element {

  const { palette } = useThemeContext()
  const tint = tryResolvePaletteColor($color, palette, palette.primaryColor)

  const containerRef = useRef<View>(null)
  useEffect(() => {
    return injectInlineCSSVariables({
      [__TINT]: tint,
    }, containerRef.current)
  }, [tint])

  const contextValue = useMemo(() => ({
    value,
    onChange,
    size,
    disabled,
  }), [disabled, onChange, size, value])

  return (
    <View
      ref={containerRef}
      className={styles.container}
      role='radiogroup'
      {...{ [DATA_DISABLED]: disabled === true }}
    >
      <SegmentedSelectionContext value={contextValue}>
        {(() => {
          const childrenAsArray = Children.toArray(children)
          const indexOfSelectedItem = childrenAsArray.findIndex((child) => (child as ReactElement<SegmentedSelectionItemProps<Value>>).props.value === value)
          const selectedItemIsDisabled = (childrenAsArray[indexOfSelectedItem] as ReactElement<SegmentedSelectionItemProps<Value>>).props.disabled || disabled
          const renderStack = []
          for (let i = 0; i < childrenAsArray.length; i++) {
            const child = childrenAsArray[i]
            renderStack.push(
              <Fragment key={i}>
                {child}
                {(i < (childrenAsArray.length - 1)) && (
                  <View
                    className={styles.separatorContainer}
                    role='presentation'
                    {...{
                      [DATA_ADJACENT_ITEM_IS_SELECTED]: i === indexOfSelectedItem ||
                        i === indexOfSelectedItem - 1,
                      [DATA_SELECTED_ITEM_IS_DISABLED]: selectedItemIsDisabled,
                    }}
                  >
                    <View className={styles.separator} />
                  </View>
                )}
              </Fragment>
            )
          }
          return renderStack
        })()}
      </SegmentedSelectionContext>
    </View>
  )
}

/**
 * @public
 */
export interface SegmentedSelectionItemProps<Value> {
  value: Value
  children?: ReactNode
  /**
   * @defaultValue `false`
   */
  disabled?: boolean
}

/**
 * @public
 */
export function SegmentedSelectionItem<Value>({
  value,
  children,
  disabled: $disabled,
}: SegmentedSelectionItemProps<Value>): JSX.Element {
  const {
    value: selectedValue,
    onChange,
    size,
    disabled: parentDisabled,
  } = useContext(SegmentedSelectionContext)
  const disabled = $disabled || parentDisabled
  return (
    <BasicButton
      className={styles.item}
      data-selected={Object.is(selectedValue, value)}
      onClick={useCallback(() => { onChange(value) }, [onChange, value])}
      template='none'
      role='radio'
      size={size}
      {...(isBoolean(disabled) ? { disabled } : {})}
    >
      {children}
    </BasicButton>
  )
}
