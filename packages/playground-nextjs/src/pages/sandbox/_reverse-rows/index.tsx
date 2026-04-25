import { multilineTrim } from '@glyph-cat/swiss-army-knife'
import { ReactNode } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

function reverseRows(value: string): string {
  return multilineTrim(value).split('\n').reverse().join('\n')
}

const text = `
// ...
`

export default function (): ReactNode {
  return (
    <SandboxContent className={styles.container}>
      <pre>
        {reverseRows(text)}
      </pre>
    </SandboxContent>
  )
}
