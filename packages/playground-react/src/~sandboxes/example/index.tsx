import { c } from '@glyph-cat/swiss-army-knife'
import { JSX } from 'react'
import { SandboxStyle } from '~constants'
import { View } from '~core-ui'
import styles from './index.module.css'

export default function (): JSX.Element {
  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>
      <h1>Hello world</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </View>
  )
}
