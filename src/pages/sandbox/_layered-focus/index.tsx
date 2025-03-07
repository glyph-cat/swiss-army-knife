import { c, Key } from '@glyph-cat/swiss-army-knife'
import { JSX, ReactNode, useCallback, useState } from 'react'
import { SandboxStyle } from '~constants'
import {
  Button,
  FocusableView,
  FocusLayer,
  useKeyDownListener,
  useLayeredFocusState,
  View,
} from '~core-ui'
import styles from './index.module.css'

export default function (): JSX.Element {
  const [showComponentB, setComponentBVisibility] = useState(false)
  const toggleComponentB = useCallback(() => {
    setComponentBVisibility(v => !v)
  }, [])
  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>
      <FocusableView className={styles.focusableView}>
        <TestComponent label='A' />
      </FocusableView>
      <FocusableView className={styles.focusableView}>
        <TestComponent label='B' />
      </FocusableView>
      <FocusableView className={styles.focusableView} ignoreSiblings>
        <TestComponent label='C'>
          <ExtraComponent />
        </TestComponent>
      </FocusableView>
      <FocusLayer ignoreSiblings>
        <Button onClick={toggleComponentB}>
          {'Show Component B'}
        </Button>
      </FocusLayer>
      {showComponentB && (
        <FocusableView className={styles.focusableView}>
          <TestComponent label='X' />
        </FocusableView>
      )}
    </View>
  )
}

interface TestComponentProps {
  label: string
  children?: ReactNode
}

function TestComponent({
  label,
  children,
}: TestComponentProps): JSX.Element {
  const [, layerId] = useLayeredFocusState()
  const [counter, setCounter] = useState(0)
  useKeyDownListener((e) => {
    if (e.key === Key.Space) {
      setCounter(x => x + 1)
    }
  }, [])
  return (
    <>
      <h1>{`FocusableView ${label} (ID: ${layerId})`}</h1>
      <h2>{`Counter: ${counter}`}</h2>
      {children}
    </>
  )
}

function ExtraComponent(): JSX.Element {
  const [renderExtraContent, setExtraContentVisibility] = useState(false)
  const showExtraContent = useCallback(() => { setExtraContentVisibility(true) }, [])
  const hideExtraContent = useCallback(() => { setExtraContentVisibility(false) }, [])
  return (
    <View style={{ gap: 10 }}>
      <Button onClick={showExtraContent}>Render extra content</Button>
      {renderExtraContent && (
        <FocusableView className={styles.focusableView}>
          <span>(Some extra content)</span>
          <Button onClick={hideExtraContent}>hide extra content</Button>
        </FocusableView>
      )}
    </View>
  )
}
