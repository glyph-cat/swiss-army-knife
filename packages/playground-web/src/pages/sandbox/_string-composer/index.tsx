import { ReactNode, useMemo } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

export default function (): ReactNode {

  const text = useMemo(() => {
    return renderToStaticMarkup(<TemplateContainer />)
  }, [])

  return (
    <SandboxContent className={styles.container}>
      <pre
        style={{
          backgroundColor: '#00000080',
          border: 'solid 1px #80808040',
          fontFamily: '14pt',
          padding: 20,
        }}
      >
        <code>
          {text}
        </code>
      </pre>
    </SandboxContent>
  )

}

// Lists can't be rendered correctly

function TemplateContainer(): ReactNode {
  const someVariable = 42
  return (
    <>
      Hello world {someVariable}
      <ul>
        <li>Apple</li>
        <li>Banana</li>
        <li>Canola</li>
      </ul>
    </>
  )
}
