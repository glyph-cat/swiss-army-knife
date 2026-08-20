import { Nullable } from '@glyph-cat/foundation'
import {
  Checkbox,
  RadioGroup,
  RadioItem,
  Switch,
  TableForm,
  TableFormItem,
  View,
} from '@glyph-cat/swiss-army-knife-react'
import { ReactNode, useState } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

export default function (): ReactNode {

  const [radioState, setRadioState] = useState<Nullable<string>>(null)
  return (
    <SandboxContent className={styles.container}>
      <View style={{
        border: 'solid 1px #80808080',
        height: 600,
        width: 600,
      }}>
        <TableForm>
          <TableFormItem label='Monika'>
            <Checkbox />
          </TableFormItem>
          <TableFormItem label='Just Monika'>
            <Checkbox />
          </TableFormItem>
          <TableFormItem label='Adore Monika'>
            <Switch />
          </TableFormItem>
          <TableFormItem label='Select character'>
            <RadioGroup value={radioState} onChange={setRadioState}>
              <RadioItem value={'Sayori'} disabled>{'Sayori'}</RadioItem>
              <RadioItem value={'Natsuki'} disabled>{'Natsuki'}</RadioItem>
              <RadioItem value={'Yuri'} disabled>{'Yuri'}</RadioItem>
              <RadioItem value={'Monika'}>{'Monika'}</RadioItem>
            </RadioGroup>
          </TableFormItem>
        </TableForm>
      </View>
    </SandboxContent>
  )
}
