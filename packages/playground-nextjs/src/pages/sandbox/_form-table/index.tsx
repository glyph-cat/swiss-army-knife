import { FormLayoutContainer, FormLayoutItem } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import { TextInput } from '~unstable/basic-ui'
import styles from './index.module.css'

export default function (): ReactNode {
  return (
    <SandboxContent className={styles.container}>
      <FormLayoutContainer>
        <FormLayoutItem title='First name'>
          <TextInput style={{ border: 'solid 1px #80808080' }} />
        </FormLayoutItem>
        <FormLayoutItem title='Last name'>
          <TextInput style={{ border: 'solid 1px #80808080' }} />
        </FormLayoutItem>
        <FormLayoutItem title='Message'>
          <TextInput style={{ border: 'solid 1px #80808080' }} />
        </FormLayoutItem>
      </FormLayoutContainer>
    </SandboxContent>
  )
}
