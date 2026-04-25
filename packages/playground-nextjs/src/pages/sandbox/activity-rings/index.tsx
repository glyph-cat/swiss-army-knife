import { ProgressRing, View } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

interface IRingStats {
  value: number
  maxValue: number
}

const activityRing: IRingStats = {
  value: 457,
  maxValue: 350
}

const exerciseRing: IRingStats = {
  value: 57,
  maxValue: 30
}

const standRing: IRingStats = {
  value: 7,
  maxValue: 12
}

export default function (): ReactNode {
  return (
    <SandboxContent className={styles.container}>
      <View style={{
        placeItems: 'center',
      }}>
        <ProgressRing
          color='#ff2b80'
          thickness={40}
          size={360}
          {...activityRing}
          allowOvershoot
          style={{ position: 'absolute' }}
        />
        <ProgressRing
          color='#80ff2b'
          thickness={40}
          size={280}
          {...exerciseRing}
          allowOvershoot
          style={{ position: 'absolute' }}
        />
        <ProgressRing
          color='#4bccff'
          thickness={40}
          size={200}
          {...standRing}
          allowOvershoot
          style={{ position: 'absolute' }}
        />
      </View>
    </SandboxContent>
  )
}
