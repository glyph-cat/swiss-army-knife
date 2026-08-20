import { ProgressRing, View } from '@glyph-cat/react-components-web'
import type { ReactNode } from 'react'
import styles from './index.module.css'

function MainScreen(): ReactNode {
  return (
    <View className={styles.container}>
      <ProgressRing>
        hi
      </ProgressRing>
      <ProgressRing value={37}>
        37
      </ProgressRing>
      <ProgressRing value={137}>
        137
      </ProgressRing>
    </View>
  )
}

export default MainScreen
