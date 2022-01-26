import { TextEmphasis } from '../../../../src'

export function TextEmphasisContainer(): JSX.Element {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <p style={{ fontSize: 48 }}>
        <TextEmphasis patterns={[/(a|e|i)/g, 'o', 'u']} component='u'>
          {'The quick brown fox jumped over the fence'}
        </TextEmphasis>
      </p>
    </div>
  )
}
