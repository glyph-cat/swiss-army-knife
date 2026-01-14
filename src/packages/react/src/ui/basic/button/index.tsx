import { c } from '@glyph-cat/css-utils'
import { LenientString } from '@glyph-cat/foundation'
import { injectInlineCSSVariables } from '@glyph-cat/swiss-army-knife'
import { ForwardedRef, forwardRef, JSX, useEffect, useImperativeHandle, useRef } from 'react'
import { __setDisplayName } from '../../../_internals'
import { useThemeContext } from '../../../styling'
import { ButtonBase, ButtonBaseProps, View } from '../../core'
import { resolveContrastingValue } from '../_internals/resolve-contrasting-color'
import { tryResolvePaletteColor } from '../_internals/try-resolve-palette-color'
import { BasicUIColor, BasicUISize } from '../abstractions'
import { __FG_COLOR, __SIZE, __TINT } from '../constants'
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
export type BasicButtonTemplate = 'none' | 'text' | 'icon'

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
   * @defaultValue `'neutral'`
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
  const tint = tryResolvePaletteColor($color, palette, palette.neutralColor)

  const [size] = sizePresets[$size] ?? sizePresets.m
  const disabled = $disabled ?? busy

  const buttonRef = useRef<ButtonBase>(null)
  useImperativeHandle(forwardedRef, () => buttonRef.current, [])

  useEffect(() => {
    return injectInlineCSSVariables({
      [__SIZE]: size,
      [__TINT]: tint,
      [__FG_COLOR]: resolveContrastingValue(tint),
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
        ? (
          <ProgressRing
            className={styles.busyIndicator}
            size={24}
            thickness={4}
            color='#808080'
          />
        )
        : <View className={styles.contentContainer}>{children}</View>
      }
    </ButtonBase>
  )
})

__setDisplayName(BasicButton)
