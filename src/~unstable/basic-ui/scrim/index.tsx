import { Nullable } from '@glyph-cat/foundation'
import { delay, Key } from '@glyph-cat/swiss-army-knife'
import { useKeyDownListener, useThemeContext, View } from '@glyph-cat/swiss-army-knife-react'
import { isFunction } from '@glyph-cat/type-checking'
import { ReactNode, useEffect, useState } from 'react'
import { animations, styles } from './styles'

export interface ScrimProps {
  children?: ReactNode
  onDismiss?(): void
  /**
   * @defaultValue `false`
  */
  visible?: boolean
  /**
   * @defaultValue `false`
   */
  dismissOnEscape?: boolean
  /**
   * @defaultValue `false`
   */
  dismissOnTap?: boolean
}

export function Scrim({
  children,
  visible = true,
  onDismiss,
  dismissOnEscape,
  dismissOnTap,
}: ScrimProps): ReactNode {

  const { duration } = useThemeContext()
  const ENTRANCE_ANIMATION_DURATION = duration.SHORT
  const EXIT_ANIMATION_DURATION = duration.LONG

  const [animationName, setAnimationName] = useState<Nullable<string>>(visible ? animations.in : null)
  const [shouldRender, setRenderState] = useState(visible)

  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRenderState(true)
      setAnimationName(animations.in)
    } else {
      setAnimationName(animations.out)
      delay(EXIT_ANIMATION_DURATION).then(() => { setRenderState(false) })
    }
  }, [EXIT_ANIMATION_DURATION, visible])

  useKeyDownListener((e) => {
    if (!dismissOnEscape) {
      if (e.key === Key.Escape) {
        if (isFunction(onDismiss)) {
          onDismiss()
          e.preventDefault() // in case there are more than one scrim at the same time
          // KIV: or is it stopPropagation?
        }
      }
    }
  }, [dismissOnEscape, onDismiss])

  return shouldRender && (
    <View className={styles.container}>
      <View
        className={styles.dimLayer}
        onClick={dismissOnTap ? onDismiss : undefined}
        style={{
          ...(animationName ? { animationName } : {}),
          animationDuration: `${animationName === animations.in
            ? ENTRANCE_ANIMATION_DURATION
            : EXIT_ANIMATION_DURATION}ms`,
        }}
      />
      <View className={styles.contentContainer}>
        {children}
      </View>
    </View>
  )

}
