import { ThemeToken } from '@glyph-cat/swiss-army-knife'
import { View } from '@glyph-cat/swiss-army-knife-react'
import { SizeAwareContainer, useSizeAwareContext } from 'packages/react/src/size-aware'
import { ReactNode } from 'react'
import { SandboxContent } from '~components/sandbox/content'

const INITIAL_SIZE = 200 // px

export default function (): ReactNode {
  return (
    <SandboxContent>
      <View
        style={{
          backgroundColor: ThemeToken.primaryColor80,
          height: INITIAL_SIZE,
          overflow: 'auto',
          resize: 'both',
          width: INITIAL_SIZE,
        }}
      >
        <SizeAwareContainer>
          <CustomView />
        </SizeAwareContainer>
      </View>
    </SandboxContent>
  )
}

function CustomView(): ReactNode {
  const bounds = useSizeAwareContext()
  return (
    <View
      style={{
        height: bounds.height,
        width: bounds.width,
      }}
    >
      <View style={{
        border: 'solid 1px #808080',
        margin: ThemeToken.spacingXL,
        placeItems: 'center',
      }}>
        <View style={{ gap: ThemeToken.spacingM }}>
          <code>height: {bounds.height}</code>
          <code>width: {bounds.width}</code>
        </View>
      </View>
    </View>
  )
}
