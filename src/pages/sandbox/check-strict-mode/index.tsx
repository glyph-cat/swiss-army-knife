import { c } from '@glyph-cat/swiss-army-knife'
import { ButtonBase, View } from '@glyph-cat/swiss-army-knife-react'
import { useCheckStrictMode } from 'packages/react/src/strict-mode'
import { Fragment, JSX, StrictMode, useReducer } from 'react'
import { SandboxStyle } from '~constants'
import styles from './index.module.css'

const strictModeReducer = (s: boolean): boolean => !s

export default function (): JSX.Element {
  const [shouldUseStrictMode, toggleStrictMode] = useReducer(strictModeReducer, false)
  const StrictModeWrapper = shouldUseStrictMode ? StrictMode : Fragment
  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>
      <ButtonBase
        className={styles.strictModeToggleButton}
        onClick={toggleStrictMode}
      >
        {`StrictMode: ${shouldUseStrictMode ? 'ON' : shouldUseStrictMode}`}
      </ButtonBase>
      <StrictModeWrapper>
        <Content />
      </StrictModeWrapper>
    </View>
  )
}

function Content(): JSX.Element {
  const isRunningInStrictMode = useCheckStrictMode()
  return (
    <span>
      Is using <code>StrictMode</code>: {isRunningInStrictMode ? 'Yes' : 'No'}
    </span>
  )
}
