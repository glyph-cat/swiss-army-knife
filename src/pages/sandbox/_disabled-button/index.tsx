import { JSX } from 'react'
import { SandboxStyle } from '~constants'
import { Button, GlobalDisabledContext, View } from '~core-ui'
// import styles from './index.module.css'

export default function (): JSX.Element {
  return (
    <View className={SandboxStyle.NORMAL}>
      <GlobalDisabledContext.Provider disabled={false}>
        <Button disabled={true}>Test button</Button>
      </GlobalDisabledContext.Provider>
    </View>
  )
}
