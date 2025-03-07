import { c, ColorScheme, ColorUtil, Theme } from '@glyph-cat/swiss-army-knife'
import { ThemeProvider, useThemeContext } from '@glyph-cat/swiss-army-knife-react'
import { JSX } from 'react'
import { SandboxStyle } from '~constants'
import { View } from '~core-ui'
import styles from './index.module.css'

const theme = new Theme('x', ColorScheme.dark)
// {
//   tint: '#2b80ff',
//   appBgColor: '#111111',
//   appTextColor: '#b5b5b5',
//   separatorColor: '#808080',
//   neutralColor: '#4b6680',
//   infoColor: '#00cccc',
//   successColor: '#00aa00',
//   warnColor: '#ff8000',
//   errorColor: '#ff3333',
//   dangerColor: '#ff4a4a',
// }, {
//   XXL: 100,
// }

export default function (): JSX.Element {
  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>
      <ThemeProvider theme={theme}>
        <Contents />
      </ThemeProvider>
    </View>
  )
}

const x = ColorUtil.createContrastingValue({
  light: '#000000',
  dark: '#ffffff'
})

function Contents(): JSX.Element {
  const { palette, spacing } = useThemeContext()
  return (
    <View>
      <ul className={styles.ul}>
        {Object.keys(palette).map((key) => {
          const value = palette[key]
          const cssToken = `var(--${key})`
          return (
            <li key={key} style={{
              color: x(value),
              display: 'grid',
              gridAutoColumns: '1fr',
              gridAutoFlow: 'column',
              height: 48,
            }}>
              <View style={{ backgroundColor: value, alignItems: 'center' }}>
                <code>{`${key} · ${value}`}</code>
              </View>
              <View style={{ backgroundColor: cssToken, alignItems: 'center' }}>
                <code>{cssToken}</code>
              </View>
            </li>
          )
        })}
      </ul>
      <br />
      <ul className={styles.ul}>
        {Object.keys(spacing).map((key) => {
          const value = spacing[key]
          const cssToken = `var(--spacing${key})`
          return (
            <li key={key} style={{
              display: 'grid',
              gridAutoColumns: '1fr',
              gridAutoFlow: 'column',
              paddingBottom: 10,
            }}>
              <View style={{
                borderBlockEnd: 'solid 2px #ff0000',
                width: value,
                whiteSpace: 'nowrap',
              }}>
                <code>{`${key} · ${value}px`}</code>
              </View>
              <View style={{
                borderBlockEnd: 'solid 2px #ff0000',
                width: cssToken,
                whiteSpace: 'nowrap',
              }}>
                <code>{cssToken}</code>
              </View>
            </li>
          )
        })}
      </ul>
    </View>
  )
}
