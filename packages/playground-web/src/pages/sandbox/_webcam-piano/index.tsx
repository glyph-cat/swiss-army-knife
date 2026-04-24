import { ReactNode } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

export default function (): ReactNode {
  return (
    <SandboxContent className={styles.container}>
      {/* Landmark visualizer L, R */}
      {/* Piano grid `bottom: 0;` */}
      {/* Creating a "black and white keys" layout that is AR friendly is difficult */}
    </SandboxContent>
  )
}
