import { ButtonBase as Button, View } from '@glyph-cat/swiss-army-knife-react'
import { Children, ReactNode } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

export default function (): ReactNode {
  return (
    <SandboxContent className={styles.container}>
      <Overflow>
        <View className={styles.subContainer}>
          <OverflowItem>
            <Button>
              {'Button A'}
            </Button>
          </OverflowItem>
          <OverflowItem>
            <Button>
              {'Button B'}
            </Button>
          </OverflowItem>
          <OverflowItem>
            <Button>
              {'Button C'}
            </Button>
          </OverflowItem>
        </View>
      </Overflow>
    </SandboxContent>
  )
}


export interface OverflowProps {
  children: ReactNode
  /**
   * @defaultValue `'horizontal'`
   */
  direction?: 'horizontal' | 'vertical'
}

export function Overflow({
  children,
  direction = 'horizontal',
}: OverflowProps): ReactNode {
  Children.only(children)
  return (
    <>
      {/*  */}
    </>
  )
}

export interface OverflowItemProps {
  children: ReactNode
}

export function OverflowItem({
  children,
}: OverflowItemProps): ReactNode {
  Children.only(children)
  return (
    <>
      {/*  */}
    </>
  )
}

export class BasicUIComposer {

  constructor() {
    // ...
  }

  createMenuComponent() {
    // ...
  }

}
