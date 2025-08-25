import { c } from '@glyph-cat/swiss-army-knife'
import { Portal, View } from '@glyph-cat/swiss-army-knife-react'
import { JSX } from 'react'
import { SandboxStyle } from '~constants'
import styles from './index.module.css'

export default function (): JSX.Element {
  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>
      <Portal>
        <h1 style={{ placeSelf: 'center' }}>
          {'Hello, world!'}
        </h1>
      </Portal>
      <Portal>{undefined}</Portal>
    </View>
  )
}
