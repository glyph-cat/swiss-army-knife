import {
  BasicButton,
  PreloadableComponent,
  ProgressRing,
  View,
} from '@glyph-cat/swiss-army-knife-react'
import { lazy, ReactNode, Suspense, useCallback, useState } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

const preloadableComponentB = new PreloadableComponent(lazy(() => import('./sample-component-b')))

const SampleComponentA = lazy(() => import('./sample-component-a'))
const SampleComponentB = preloadableComponentB.component

export default function (): ReactNode {

  const [shouldShowComponentA, setComponentVisibilityA] = useState(false)
  const [shouldShowComponentB, setComponentVisibilityB] = useState(false)

  return (
    <SandboxContent className={styles.container}>
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
    </SandboxContent>
  )

}
