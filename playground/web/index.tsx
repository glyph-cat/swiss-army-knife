import { StrictMode as ReactStrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Containers } from './containers'

function PlaygroundWeb(): JSX.Element {
  return <Containers />
}

ReactDOM.render(
  <ReactStrictMode>
    <PlaygroundWeb />
  </ReactStrictMode>,
  document.getElementById('root')
)
