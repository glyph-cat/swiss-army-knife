import { c } from '@glyph-cat/swiss-army-knife'
import { JSX } from 'react'
import { SandboxStyle } from '~constants'
import { GlobalInputFocusTracker, Input, useCheckInputFocus, View } from '~core-ui'
import styles from './index.module.css'

export default function (): JSX.Element {
  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>
      <Input />
      <Meow />
    </View>
  )
}

function Meow(): JSX.Element {
  const isAnyInputFocused = useCheckInputFocus()
  return (
    <pre>
      <code>isAnyInputFocused: {String(isAnyInputFocused)}</code>
      <br />
      <code>{JSON.stringify(GlobalInputFocusTracker, null, 2)}</code>
    </pre>
  )
}
