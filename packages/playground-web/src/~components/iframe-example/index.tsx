import { View } from '@glyph-cat/swiss-army-knife-react'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import styles from './index.module.css'

export interface IFrameExampleProps {
  title: string
  path: string
}

export function IFrameExample({ title, path }: IFrameExampleProps): ReactNode {
  const { route } = useRouter()
  const examplesRoute = `${route}/examples`
  return (
    <View className={styles.container}>
      <View className={styles.title}>{title}</View>
      <iframe
        className={styles.iframe}
        src={`${examplesRoute}/${path}`}
      />
    </View>
  )
}
