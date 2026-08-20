import { ReactNode } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import { SplitView, SplitViewContainer } from '~unstable/split-view'
import styles from './index.module.css'

export default function (): ReactNode {
  return (
    <SandboxContent className={styles.container}>
      <SplitViewContainer
        sizes={{ a: 300, b: 'auto', c: 100 }}
        style={{
          border: 'solid 1px #808080',
          height: 100,
        }}
      >
        <SplitView key='a' style={{ backgroundColor: '#2b80ff2b' }}>
          {'A'}
        </SplitView>
        <SplitView key='b' style={{ backgroundColor: '#ff2b802b' }}>
          {'B'}
        </SplitView>
        <SplitView key='c' style={{ backgroundColor: '#2bff802b' }}>
          {'C'}
        </SplitView>
      </SplitViewContainer>
    </SandboxContent>
  )
}
