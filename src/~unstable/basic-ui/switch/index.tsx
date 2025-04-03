import { c, injectInlineCSSVariables, isNumber, LenientString } from '@glyph-cat/swiss-army-knife'
import { ButtonBase, useThemeContext } from '@glyph-cat/swiss-army-knife-react'
import { ChangeEvent, forwardRef, JSX, ReactNode, useEffect, useRef } from 'react'
import { tryResolvePaletteColor } from '../_internals/try-resolve-palette-color'
import { BasicUIColor, BasicUISize } from '../abstractions'
import { KEY_SIZE, KEY_TINT } from '../constants'
import { styles } from './styles'

const sizePresets: Readonly<Record<BasicUISize, number>> = {
  's': 22,
  'm': 28,
  'l': 36,
}

export interface SwitchProps {
  children?: ReactNode
  value?: boolean
  onChange?(newValue: boolean, event: ChangeEvent<HTMLButtonElement>): void
  /**
   * @defaultValue `false`
   */
  disabled?: boolean
  /**
   * @defaultValue `false`
   */
  busy?: boolean
  /**
   * @defaultValue `'m'`
   */
  size?: BasicUISize
  /**
   * @defaultValue `'primary'`
   */
  color?: LenientString<BasicUIColor>
}

export const Switch = forwardRef(({
  children,
  value,
  onChange,
  disabled: $disabled,
  busy,
  size,
  color: $color,
  // ...props
}: SwitchProps, forwardedRef): JSX.Element => {

  const { palette, componentParameters } = useThemeContext()

  const color = tryResolvePaletteColor($color, palette)

  const effectiveSize = isNumber(size) ? size : (sizePresets[size] ?? sizePresets.m)

  const containerRef = useRef<HTMLLabelElement>(null)
  useEffect(() => {
    return injectInlineCSSVariables({
      [KEY_TINT]: color,
      [KEY_SIZE]: effectiveSize,
    }, containerRef.current)
  }, [color, effectiveSize])

  // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/switch_role

  return (
    <label ref={containerRef}>
      <ButtonBase
        className={c(styles.container)}
        role='switch'
        aria-pressed={value}
      // {...props}
      />
    </label>
  )
})
