import { Portal } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

export default function (): ReactNode {
  return (
    <SandboxContent className={styles.container}>
      <Portal>
        <h1 style={{ placeSelf: 'center' }}>
          {'Hello, world!'}
        </h1>
      </Portal>
      <Portal>{undefined}</Portal>
    </SandboxContent>
  )
}
