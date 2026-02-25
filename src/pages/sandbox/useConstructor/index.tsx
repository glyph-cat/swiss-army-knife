import { StringRecord } from '@glyph-cat/foundation'
import { objectMap } from '@glyph-cat/swiss-army-knife'
import { ClientOnly, forceUpdateReducer, useConstructor, View } from '@glyph-cat/swiss-army-knife-react'
import { SimpleStateManager } from 'cotton-box'
import { useSimpleStateValue } from 'cotton-box-react'
import { IDisposable } from 'monaco-editor'
import { ReactNode, useReducer } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

export default function (): ReactNode {
  return (
    <SandboxContent className={styles.container}>
      <span>
        History of IDs are being tracked globally for visibility.
        <br />
        Toggle Strict Mode or trigger Soft Reload from the sidebar to observe the results.
      </span>
      <Content />
    </SandboxContent>
  )
}

function Content(): ReactNode {

  const [forceUpdateCounter, forceUpdate] = useReducer(forceUpdateReducer, 0)

  const lazyValue = useConstructor(() => {
    const foo = new Foo()
    return [foo, foo.dispose]
  })

  return (
    <>
      <span>
        Triggering
        <button
          style={{ display: 'inline-block', marginInline: '0.5em' }}
          onClick={forceUpdate}
        >
          forceUpdate
        </button>
        on parent component will not affect the hook.
      </span>
      <span>
        Instance ID: <code><ClientOnly>{lazyValue.id}</ClientOnly></code>
        <br />
        Force Update Counter: <code>{forceUpdateCounter}</code>
      </span>
      <ClientOnly>
        <StateVisualizer />
      </ClientOnly>
    </>
  )
}

function StateVisualizer(): ReactNode {
  const disposalState = useSimpleStateValue(DisposalState)
  return (
    <View className={styles.visualizerContainer}>
      {objectMap(disposalState, (disposed, key) => {
        return (
          <View
            key={key}
            className={styles.visualizerItem}
            data-active={!disposed}
          >
            <code>
              {key}
            </code>
          </View>
        )
      })}
    </View>
  )
}

const DisposalState = new SimpleStateManager<StringRecord<boolean>>({})

class Foo implements IDisposable {

  static idCounter: number = 0

  // readonly id = String(Math.round(Date.now() / 1000))
  readonly id = String(++Foo.idCounter)

  private _isDisposed: boolean = false

  constructor() {
    console.log(`Initializing "${this.id}"`)
    this.dispose = this.dispose.bind(this)
    setTimeout(() => {
      DisposalState.set((s) => ({ ...s, [this.id]: false }))
    }, 100)
  }

  dispose(): void {
    if (this._isDisposed) {
      console.error(`Already disposed "${this.id}"`)
    } else {
      console.log(`Disposing "${this.id}"`)
      this._isDisposed = true
      setTimeout(() => {
        DisposalState.set((s) => ({ ...s, [this.id]: true }))
      }, 100)
    }
  }

}
