import { useRouter } from 'next/router'
import { JSX, useCallback } from 'react'
import { View } from '~core-ui'
import { APIOpenSandboxInEditor } from '~services/api/endpoints/sandboxes/open-in-editor'
import styles from './index.module.css'

export function SandboxStarter(): JSX.Element {

  const router = useRouter()

  const onOpenInEditor = useCallback(async () => {
    await APIOpenSandboxInEditor({ sandboxName: router.asPath.replace(/^\/sandbox\//, '') })
  }, [router.asPath])

  return (
    <View className={styles.container}>
      <View className={styles.subContainer}>
        <h1>This is a new sandbox</h1>
        <p style={{ fontSize: '14pt' }}>
          {'You can visit '}
          <span className={'a'} onClick={onOpenInEditor}>
            <code>{router.asPath}.tsx</code>
          </span>
          {' to begin editing'}
        </p>
      </View>
    </View>
  )
}
