import { CSSPropertiesExtended } from '@glyph-cat/css-utils'
import { View } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode } from 'react'
import styles from './index.module.css'

export interface VariationDisplayContainerProps {
  children?: ReactNode
  style?: CSSPropertiesExtended
}

export function VariationDisplayContainer({
  children,
  style,
}: VariationDisplayContainerProps): ReactNode {
  return (
    <View className={styles.container} style={style}>
      {children}
    </View>
  )
}
