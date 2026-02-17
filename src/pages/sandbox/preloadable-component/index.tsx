import {
  BasicButton,
  PreloadableComponent,
  ProgressRing,
  View,
} from '@glyph-cat/swiss-army-knife-react'
import clsx from 'clsx'
import { JSX, lazy, Suspense, useCallback, useState } from 'react'
import { SandboxStyle } from '~constants'
import styles from './index.module.css'

const preloadableComponentB = new PreloadableComponent(lazy(() => import('./sample-component-b')))

const SampleComponentA = lazy(() => import('./sample-component-a'))
const SampleComponentB = preloadableComponentB.component

export default function (): JSX.Element {

  const [shouldShowComponentA, setComponentVisibilityA] = useState(false)
  const [shouldShowComponentB, setComponentVisibilityB] = useState(false)

  return (
    <View className={clsx(SandboxStyle.NORMAL, styles.container)}>
      <View className={styles.subContainer}>
        <BasicButton
          disabled={shouldShowComponentA}
          onClick={useCallback(() => {
            setComponentVisibilityA(true)
          }, [])}
        >
          {'Show component without preloading'}
        </BasicButton>
        <View className={styles.sampleComponentContainer}>
          {shouldShowComponentA && (
            <Suspense fallback={<ProgressRing />}>
              <SampleComponentA />
            </Suspense>
          )}
        </View>
      </View>
      <View className={styles.subContainer}>
        <BasicButton
          disabled={shouldShowComponentB}
          onPointerEnter={useCallback(() => {
            preloadableComponentB.preload()
          }, [])}
          onClick={useCallback(() => {
            setComponentVisibilityB(true)
          }, [])}
        >
          {'Show component with preloading enabled'}
        </BasicButton>
        <View className={styles.sampleComponentContainer}>
          {shouldShowComponentB && (
            <Suspense fallback={<ProgressRing />}>
              <SampleComponentB />
            </Suspense>
          )}
        </View>
      </View>
    </View>
  )

}
