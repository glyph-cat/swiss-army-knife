import { Portal } from '@glyph-cat/swiss-army-knife-react'
import { JSX } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

export default function (): JSX.Element {
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
