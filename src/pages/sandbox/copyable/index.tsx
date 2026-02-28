import { View } from '@glyph-cat/swiss-army-knife-react'
import clsx from 'clsx'
import { ReactNode } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import { Copyable } from '~unstable/copyable'
import styles from './index.module.css'

export default function (): ReactNode {
  return (
    <SandboxContent className={styles.container}>
      <Copyable>
        <CustomComponentThatDoesNotForwardRef />
      </Copyable>
    </SandboxContent>
  )
}

function CustomComponentThatDoesNotForwardRef(): ReactNode {
  return <AnotherNestedComponent />
}

function AnotherNestedComponent(): ReactNode {
  return (
    <>
      <p>Hello world</p>
      {/* <p>Hello world</p> */}
    </>
  )
}
