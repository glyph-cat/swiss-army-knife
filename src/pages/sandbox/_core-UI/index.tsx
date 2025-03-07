import { JSX } from 'react'
import { SandboxStyle } from '~constants'
import { Button, Input, View } from '~core-ui'
import styles from './index.module.css'

export default function (): JSX.Element {
  return (
    <View className={SandboxStyle.NORMAL}>
      <h1>Hello world</h1>
      <Button>Test button</Button>
      <Input className={styles.input} />
      <label>
        <Input type='checkbox' className={styles.checkbox} />
        Checkbox
      </label>
    </View>
  )
}
