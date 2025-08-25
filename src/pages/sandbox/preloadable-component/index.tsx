import { c } from '@glyph-cat/swiss-army-knife'
import { BasicButton, PreloadableComponent, View } from '@glyph-cat/swiss-army-knife-react'
import { JSX, lazy, Suspense, useCallback, useState } from 'react'
import { SandboxStyle } from '~constants'
import styles from './index.module.css'

const preloadableComponent = new PreloadableComponent(lazy(() => import('./sample-component')))

const SampleComponent = preloadableComponent.component

export default function (): JSX.Element {

  const [shouldShowComponent, setComponentVisibility] = useState(false)

  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>
      <BasicButton
        onPointerEnter={useCallback(() => {
          preloadableComponent.preload()
        }, [])}
        onClick={useCallback(() => {
          setComponentVisibility(true)
        }, [])}
      >
        {'Show component'}
      </BasicButton>
      {shouldShowComponent && (
        <Suspense>
          <SampleComponent />
        </Suspense>
      )}
    </View>
  )

}
