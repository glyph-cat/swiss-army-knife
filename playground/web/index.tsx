import { StrictMode as ReactStrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Containers } from './containers'

function PlaygroundWeb(): JSX.Element {
  return <Containers />
}

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <ReactStrictMode>
    <PlaygroundWeb />
  </ReactStrictMode>,
)
