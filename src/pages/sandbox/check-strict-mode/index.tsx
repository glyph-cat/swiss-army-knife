import { View } from '@glyph-cat/swiss-army-knife-react'
import clsx from 'clsx'
import { useCheckStrictMode } from 'packages/react/src/strict-mode'
import { Fragment, JSX, StrictMode, useReducer } from 'react'
import { SandboxStyle } from '~constants'
import styles from './index.module.css'

const strictModeReducer = (s: boolean): boolean => !s

export default function (): JSX.Element {
  const [shouldUseStrictMode, toggleStrictMode] = useReducer(strictModeReducer, false)
  const StrictModeWrapper = shouldUseStrictMode ? StrictMode : Fragment
  return (
    <View className={clsx(SandboxStyle.NORMAL, styles.container)}>
      <button
        className={styles.strictModeToggleButton}
        onClick={toggleStrictMode}
      >
        {`StrictMode: ${shouldUseStrictMode ? 'ON' : 'OFF'}`}
      </button>
      <StrictModeWrapper>
        <Content />
      </StrictModeWrapper>
    </View>
  )
}

function Content(): JSX.Element {
  const isRunningInStrictMode = useCheckStrictMode()
  return (
    <pre>
      <code>
        <span style={{ color: '#2b80ff' }}>{'const '}</span>
        <span style={{ color: '#3fa2ffff' }}>{'isRunningInStrictMode'}</span>
        <span>{' = '}</span>
        <span style={{ color: '#bc9123ff' }}>{'useCheckStrictMode'}</span>
        <span>{'()'}</span>
        <br />
        <span style={{ color: '#008000' }}>
          {`// ${isRunningInStrictMode}`}
        </span>
      </code>
    </pre>
  )
}
