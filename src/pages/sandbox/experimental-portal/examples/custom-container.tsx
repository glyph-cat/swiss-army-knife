import { ExperimentalPortal, useMountedState, View } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode, useRef } from 'react'

export default function Example(): ReactNode {
  const containerRef = useRef<View>(null)
  const { current: altContainer } = containerRef
  const isMounted = useMountedState()
  return (
    <>
      <View
        ref={containerRef}
        style={{
          backgroundColor: '#ffa00040',
          border: '1px solid #ffa000',
          minHeight: 100,
        }}
      >
        {(isMounted && altContainer) && (
          <ExperimentalPortal container={altContainer}>
            <h1>Hello, world!</h1>
          </ExperimentalPortal>
        )}
      </View>
      <View
        ref={containerRef}
        style={{
          backgroundColor: '#00ffff40',
          border: '1px solid #00ffff',
          minHeight: 100,
        }}
      />
    </>
  )
}
