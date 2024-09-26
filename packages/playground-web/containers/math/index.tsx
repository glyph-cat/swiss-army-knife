import { clamp } from '../../../../src'

export function MathContainer(): JSX.Element {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <span style={{ fontSize: 72, fontWeight: 'bold' }}>
        {'Hello World'}
        <br />
        clamp(2, 5, 10) = {clamp(2, 5, 10)}
      </span>
    </div>
  )
}
