import { ButtonBase, Trigger, View } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode } from 'react'

export default function (): ReactNode {
  return (
    <>
      <Trigger>
        <Trigger.Target>
          <ButtonBase>{'Test button'}</ButtonBase>
        </Trigger.Target>
        <Trigger.Spawn click>
          <View>
            {'Hello sekai'}
          </View>
        </Trigger.Spawn>
      </Trigger>
    </>
  )
}
