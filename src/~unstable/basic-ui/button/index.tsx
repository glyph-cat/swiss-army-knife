import { c, injectInlineCSSVariables, LenientString } from '@glyph-cat/swiss-army-knife'
import { ButtonBase, ButtonBaseProps, useThemeContext, View } from '@glyph-cat/swiss-army-knife-react'
import { ForwardedRef, forwardRef, JSX, useEffect, useImperativeHandle, useRef } from 'react'
import { tryResolvePaletteColor } from '../_internals/try-resolve-palette-color'
import { BasicUIColor, BasicUISize } from '../abstractions'
import { __SIZE, __TINT } from '../constants'
import { ProgressRing } from '../progress-ring'
import { styles } from './styles'

const sizePresets: Record<BasicUISize, [height: number]> = {
  's': [32],
  'm': [42],
  'l': [54],
} as const

/**
 * @public
 */
export type BasicButtonTemplate = 'text' | 'icon'

/**
 * @public
 */
export interface BasicButtonProps extends ButtonBaseProps {
  /**
   * @defaultValue `false`
   */
  busy?: boolean
  /**
   * @defaultValue `'text'`
   */
  template?: BasicButtonTemplate
  /**
   * @defaultValue `'m'`
   */
  size?: BasicUISize
  /**
   * @defaultValue `'primary'`
   */
  color?: LenientString<BasicUIColor>
}

/**
 * @public
 */
export const BasicButton = forwardRef(({
  children,
  busy,
  size: $size,
  color: $color,
  template = 'text',
  disabled: $disabled,
  className,
  ...props
}: BasicButtonProps, forwardedRef: ForwardedRef<HTMLButtonElement>): JSX.Element => {

  const { palette } = useThemeContext()
  const tint = tryResolvePaletteColor($color, palette)

  const [size] = sizePresets[$size] ?? sizePresets.m
  const disabled = $disabled ?? busy

  const buttonRef = useRef<ButtonBase>(null)
  useImperativeHandle(forwardedRef, () => buttonRef.current, [])

  useEffect(() => {
    return injectInlineCSSVariables({
      [__SIZE]: size,
      [__TINT]: tint,
    }, buttonRef.current)
  }, [size, tint])

  return (
    <ButtonBase
      className={c(styles.button, className)}
      disabled={disabled}
      {...props}
      ref={buttonRef}
      data-template={template}
    >
      {busy
        ? <ProgressRing
          className={styles.busyIndicator}
          size={24}
          thickness={4}
          color='#808080'
        />
        : <View className={styles.contentContainer}>{children}</View>
      }
    </ButtonBase>
  )
})
