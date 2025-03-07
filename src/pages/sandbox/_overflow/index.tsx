import { c } from '@glyph-cat/swiss-army-knife'
import { Children, JSX, ReactNode } from 'react'
import { SandboxStyle } from '~constants'
import { Button, View } from '~core-ui'
import styles from './index.module.css'

export default function (): JSX.Element {
  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>
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
    </View>
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
}: OverflowProps): JSX.Element {
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
}: OverflowItemProps): JSX.Element {
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
