import { View } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode } from 'react'

function Sandbox(): ReactNode {
  return (
    <View
      style={{
        minHeight: '100vh',
        placeItems: 'center',
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: '16pt', opacity: 0.65 }}>
        {'Select an item on the sidebar to begin'}
      </span>
    </View>
  )
}

export default Sandbox
