import { c } from '@glyph-cat/swiss-army-knife'
import { Children, JSX, ReactNode } from 'react'
import { SandboxStyle } from '~constants'
import { View } from '~core-ui'
import styles from './index.module.css'

export default function (): JSX.Element {
  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>
      <KeepInScreenBounds>
        <View>
          {'hello world'}
        </View>
      </KeepInScreenBounds>
    </View>
  )
}

export interface KeepInScreenBoundsProps {
  children: ReactNode
}

export function KeepInScreenBounds({
  children,
}: KeepInScreenBoundsProps): JSX.Element {
  Children.only(children)
  return (
    <div>
      {children}
    </div>
  )
}
