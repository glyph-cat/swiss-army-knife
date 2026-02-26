import { forceUpdateReducer, View } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode, useReducer } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import { HTMLComment } from '~unstable/html-comment'
import styles from './index.module.css'

export default function (): ReactNode {

  const [key, forceUpdate] = useReducer(forceUpdateReducer, 0)

  return (
    <SandboxContent className={styles.container}>
      <button onClick={forceUpdate}>forceUpdate</button>
      <View
        style={{
          backgroundColor: '#80808020',
          border: 'solid 1px #808080',
          height: 300,
          width: 300,
        }}
      >
        <HTMLComment key={key}>
          xyz
        </HTMLComment>
        <span>hello</span>
      </View>
    </SandboxContent>
  )
}
