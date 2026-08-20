import { useCheckStrictMode } from 'packages/react/src/strict-mode'
import { Fragment, ReactNode, StrictMode, useReducer } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

const strictModeReducer = (s: boolean): boolean => !s

export default function (): ReactNode {
  const [shouldUseStrictMode, toggleStrictMode] = useReducer(strictModeReducer, false)
  const StrictModeWrapper = shouldUseStrictMode ? StrictMode : Fragment
  return (
    <SandboxContent className={styles.container}>
      <button
        className={styles.strictModeToggleButton}
        onClick={toggleStrictMode}
      >
        {`StrictMode: ${shouldUseStrictMode ? 'ON' : 'OFF'}`}
      </button>
      <StrictModeWrapper>
        <Content />
      </StrictModeWrapper>
    </SandboxContent>
  )
}

function Content(): ReactNode {
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
