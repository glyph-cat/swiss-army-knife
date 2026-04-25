import { ThemeToken } from '@glyph-cat/swiss-army-knife'
import { View } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

export default function (): ReactNode {
  return (
    <SandboxContent>
      <View
        style={{
          borderRadius: 20,
          // borderRadius: 40,
          // @ts-expect-error because it is a non-standard property
          cornerShape: 'superellipse(2)',
          placeSelf: 'center',
          height: 200,
          width: 300,
          backgroundColor: '#80808020',
          border: 'solid 1px #80808080',
          overflow: 'hidden',
          padding: ThemeToken.spacingL,
          boxShadow: '0px 5px 50px 0px #80808020',
          // boxShadow: '0px 3px 5px 5px #ffffff40',
          gridTemplate: 'auto 1fr auto',
        }}
      >
        <View style={{ fontSize: '24pt', fontWeight: 'bold' }}>{'Title'}</View>
        <View>{'Body message'}</View>
        <View>
          <View style={{
            borderRadius: 10,
            // borderRadius: 20,
            // @ts-expect-error because it is a non-standard property
            cornerShape: 'superellipse(2)',
            placeItems: 'center',
            backgroundColor: '#2b80ff',
            color: '#ffffff',
            overflow: 'hidden',
          }}>{'Button'}</View>
        </View>
      </View>
    </SandboxContent>
  )
}
