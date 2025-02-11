import { JSX } from 'react'
import { SandboxStyle } from '~constants'
import { View } from '~core-ui'
import styles from './index.module.css'

export default function (): JSX.Element {
  return (
    <View className={SandboxStyle.NORMAL}>
      <h1>Hello world</h1>
    </View>
  )
}
