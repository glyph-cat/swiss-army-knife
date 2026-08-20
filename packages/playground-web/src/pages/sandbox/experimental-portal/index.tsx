import { ReactNode } from 'react'
import { IFrameExample } from '~components/iframe-example'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

export default function (): ReactNode {

  return (
    <SandboxContent className={styles.container}>

      <IFrameExample
        title='Normal'
        path='normal'
      />

      <IFrameExample
        title='Undefined children'
        path='undefined-children'
      />

      <IFrameExample
        title='Custom Container'
        path='custom-container'
      />

      <IFrameExample
        title='With Provider'
        path='with-provider'
      />

      {/* <Portal>
        <h1 style={{ placeSelf: 'center' }}>
          {'Hello, world!'}
        </h1>
      </Portal>

      <Portal>{undefined}</Portal> */}

      {/* <PortalProvider>
        <Portal container={altContainer} renderKey='alt'>
          <h1>Hello world</h1>
        </Portal>
      </PortalProvider> */}

    </SandboxContent>
  )
}
