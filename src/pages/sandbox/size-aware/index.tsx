import { c, ThemeToken } from '@glyph-cat/swiss-army-knife'
import { View } from '@glyph-cat/swiss-army-knife-react'
import { SizeAwareContainer, useSizeAwareContext } from 'packages/react/src/size-aware'
import { JSX } from 'react'
import { SandboxStyle } from '~constants'
import styles from './index.module.css'

const INITIAL_SIZE = 200 // px

export default function (): JSX.Element {
  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>
      <View style={{
        backgroundColor: ThemeToken.primaryColor80,
        height: INITIAL_SIZE,
        overflow: 'auto',
        resize: 'both',
        width: INITIAL_SIZE,
      }}>
        <SizeAwareContainer>
          <CustomView />
        </SizeAwareContainer>
      </View>
    </View>
  )
}


function CustomView(): JSX.Element {
  const { contentRect } = useSizeAwareContext()
  return (
    <View style={{
      height: contentRect.height,
      width: contentRect.width,
    }}>
      <View style={{
        border: 'solid 1px #808080',
        margin: ThemeToken.spacingXL,
        placeItems: 'center',
      }}>
        <View style={{ gap: ThemeToken.spacingM }}>
          <code>height: {contentRect.height}</code>
          <code>width: {contentRect.width}</code>
        </View>
      </View>
    </View>
  )
}
