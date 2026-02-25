import { StringRecord } from '@glyph-cat/foundation'
import { ClientOnly, forceUpdateReducer, useConstructor } from '@glyph-cat/swiss-army-knife-react'
import { SimpleStateManager } from 'cotton-box'
import { useSimpleStateValue } from 'cotton-box-react'
import { IDisposable } from 'monaco-editor'
import { ReactNode, useReducer } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import { CustomDebugger } from '~services/debugging'
import styles from './index.module.css'

export default function (): ReactNode {
  const [key, bumpKey] = useReducer(forceUpdateReducer, 0)
  return (
    <SandboxContent>
      <button onClick={CustomDebugger.toggleStrictMode}>toggleStrictMode</button>
      <button onClick={bumpKey}>bumpKey</button>
      <Content key={key} />
      <br />
      <br />
      <br />
      {/* <pre style={{ backgroundColor: '#2b4b6a80' }}>
        <code>
          {renderToStaticMarkup(<Content />)}
        </code>
      </pre> */}
    </SandboxContent>
  )
}

function Content(): ReactNode {

  const [, forceUpdate] = useReducer(forceUpdateReducer, 0)

  const lazyValue = useConstructor(() => {
    const foo = new Foo()
    return [foo, foo.dispose]
  })

  const disposalState = useSimpleStateValue(DisposalState)

  return (
    <>
      <button onClick={forceUpdate}>forceUpdate</button>
      {/* <>{String(arrRef.current)}</> */}
      <pre style={{ fontSize: '12pt' }}>
        <code>
          <ClientOnly>
            id: {lazyValue.id}
          </ClientOnly>
          <br />
          <ClientOnly>
            {JSON.stringify(disposalState, null, 2)}
          </ClientOnly>
        </code>
      </pre>
    </>
  )
}

const DisposalState = new SimpleStateManager<StringRecord<boolean>>({})

class Foo implements IDisposable {

  static idCounter: number = 1000

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
