import { JSX } from 'react'
import { View } from '~core-ui'
import styles from './index.module.css'

export default function (): JSX.Element {
  return (
    <View className={styles.container}>
      <h1>Hello world</h1>
    </View>
  )
}
