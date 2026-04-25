import { View } from '@glyph-cat/swiss-army-knife-react'
import { Children, ReactNode } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

export default function (): ReactNode {
  return (
    <SandboxContent className={styles.container}>
      <KeepInScreenBounds>
        <View>
          {'hello world'}
        </View>
      </KeepInScreenBounds>
    </SandboxContent>
  )
}

export interface KeepInScreenBoundsProps {
  children: ReactNode
}

export function KeepInScreenBounds({
  children,
}: KeepInScreenBoundsProps): ReactNode {
  Children.only(children)
  return (
    <View>
      {children}
    </View>
  )
}
