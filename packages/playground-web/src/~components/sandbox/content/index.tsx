import { View, ViewProps } from '@glyph-cat/swiss-army-knife-react'
import clsx from 'clsx'
import { lazy, ReactNode, Suspense } from 'react'
import styles from './index.module.css'

const SandboxStarter = lazy(() => import('../starter'))

export interface SandboxContentProps extends ViewProps {
  children?: ReactNode
}

export function SandboxContent({
  children,
  className,
  ...otherProps
}: SandboxContentProps): ReactNode {
  return (
    <View
      className={clsx(styles.container, className)}
      {...otherProps}
    >
      {children ?? (
        <Suspense>
          <SandboxStarter />
        </Suspense>
      )}
    </View>
  )
}
