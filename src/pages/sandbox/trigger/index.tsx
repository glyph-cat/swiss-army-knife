import { ButtonBase, Trigger, View } from '@glyph-cat/swiss-army-knife-react'
import { JSX } from 'react'

export default function (): JSX.Element {
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
