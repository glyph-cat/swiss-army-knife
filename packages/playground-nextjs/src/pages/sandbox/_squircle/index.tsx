import { DoNotRender, View } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles_old from './index-old.module.css'
import styles from './index.module.css'

// More refs:
// - https://monokai.com/articles/monoco-squircle-shapes-for-html-elements
// - https://codepen.io/herrstrietzel/pen/jOQEjEm?editors=0010
// - https://stackoverflow.com/questions/76321736/how-to-create-a-squircle-with-a-border

const size = 120 // px
const corner = 25 // px

export default function (): ReactNode {
  return (
    <SandboxContent className={styles.container}>

      <View
        className={styles.squircleA}
        style={{
          color: '#ffffff',
          height: 48,
          width: 240,
          placeItems: 'center',
          textAlign: 'center',
        }}
      >
        {'Hello'}
      </View>

      <View style={{ gridAutoFlow: 'column', gap: 20, paddingBlock: 100, placeSelf: 'start' }}>

        <View
          className={styles.squircleB}
          style={{
            color: '#ffffff',
            height: size,
            width: size,
            placeItems: 'center',
            textAlign: 'center',
          }}
        />

        <View
          style={{
            color: '#ffffff',
            // @ts-expect-error
            cornerShape: 'superellipse(2)',
            borderRadius: corner * 2,
            backgroundColor: '#2b80ff',
            height: size,
            width: size,
            placeItems: 'center',
            textAlign: 'center',
          }}
        />

        <View
          style={{
            color: '#ffffff',
            borderRadius: corner,
            backgroundColor: '#2b80ff',
            height: size,
            width: size,
            placeItems: 'center',
            textAlign: 'center',
          }}
        />

      </View>

      <DoNotRender>
        <View
          style={{
            backgroundColor: '#ffffff',
            gap: 50,
            gridAutoFlow: 'column',
            gridTemplateColumns: 'max-content',
            justifyItems: 'start',
            padding: 50,
          }}
        >
          <View className={styles_old.div2} />
          <View className={styles_old.div} />
        </View>
      </DoNotRender>

    </SandboxContent>
  )
}
