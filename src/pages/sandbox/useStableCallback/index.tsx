import clsx from 'clsx'
import { getRandomNumber } from '@glyph-cat/swiss-army-knife'
import { View } from '@glyph-cat/swiss-army-knife-react'
import { useStableCallback } from 'packages/react/src/hooks/callback/stable'
import { JSX, useCallback, useEffect, useState } from 'react'
import { SandboxStyle } from '~constants'
import styles from './index.module.css'

export default function (): JSX.Element {

  const unstableValue = getRandomNumber(0, 100)

  const [value, setValue] = useState(0)
  const stableCallback = useStableCallback(() => {
    setValue(unstableValue)
  })
  useEffect(() => {
    console.log('Initializing effect...')
    const intervalRef = setInterval(() => { stableCallback() }, 1000)
    return () => { clearInterval(intervalRef) }
  }, [stableCallback])

  const [altValue, setAltValue] = useState(0)
  const staleCallback = useCallback(() => {
    setAltValue(unstableValue)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // ^ We are leaving out the dependency on purpose for comparison
  useEffect(() => {
    const intervalRef = setInterval(() => { staleCallback() }, 1000)
    return () => { clearInterval(intervalRef) }
  }, [staleCallback])

  return (
    <View className={clsx(SandboxStyle.NORMAL, styles.container)}>
      <pre style={{ fontSize: '24pt' }}>
        <code>
          value: {value}
          <br />
          altValue: {altValue}
        </code>
      </pre>
      <p>
        As we can see, <code>altValue</code> remains unchanged because <code>unstableValue</code> was left out of the dependency list.
        <br /><br />
        Upon opening the browser console, we can also see that <code>{'\'Initializing effect...\''}</code> is only being logged once because the reference to <code>stableCallback</code> does not change.
      </p>
    </View>
  )
}
