import { c, ColorScheme, Theme } from '@glyph-cat/swiss-army-knife'
import { ThemeProvider } from '@glyph-cat/swiss-army-knife-react'
import { JSX, useState } from 'react'
import { SandboxStyle } from '~constants'
import { GlobalCoreUIComposer, View as PlaygroundView } from '~core-ui'
import { BasicUIComposer } from './basic-ui'
import pageStyles from './index.module.css'

const basicUIComposer = new BasicUIComposer('x', GlobalCoreUIComposer)
const Checkbox = basicUIComposer.createCheckboxComponent('x')

const theme = new Theme('x', ColorScheme.dark, {
  tint: '#2b80ff',
  appBgColor: '#111111',
  appTextColor: '#b5b5b5',
  separatorColor: '#808080',
  neutralColor: '#4b6680',
  infoColor: '#00cccc',
  successColor: '#00aa00',
  warnColor: '#ff8000',
  errorColor: '#ff3333',
  dangerColor: '#ff4a4a',
})

export default function (): JSX.Element {
  const [checked, setChecked] = useState(false)
  return (
    <ThemeProvider theme={theme}>
      <PlaygroundView className={c(SandboxStyle.NORMAL, pageStyles.container)}>
        <PlaygroundView style={{
          backgroundColor: '#80808020',
          padding: 20,
        }}>
          <Checkbox
            checked={checked}
            onChange={setChecked}
            label='testing'
          />
        </PlaygroundView>
      </PlaygroundView>
    </ThemeProvider>
  )
}
