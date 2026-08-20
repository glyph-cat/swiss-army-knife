import { ReactNode } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import { useDocumentFocus } from '../../../packages/react/src/document-focus'
import styles from './index.module.css'

export default function (): ReactNode {
  const documentIsFocused = useDocumentFocus()
  return (
    <SandboxContent className={styles.container}>
      Document Is Focused: {documentIsFocused ? 'Yes' : 'No'}
    </SandboxContent>
  )
}
