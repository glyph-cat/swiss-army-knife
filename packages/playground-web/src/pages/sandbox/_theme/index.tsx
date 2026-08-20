import { ColorScheme, prepareContrastingValue, TemplateStyles, Theme } from '@glyph-cat/swiss-army-knife'
import { ThemeProvider, useThemeContext, View } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

const theme = new Theme(ColorScheme.dark)

export default function (): ReactNode {
  return (
    <SandboxContent className={styles.container}>
      <ThemeProvider theme={theme}>
        <View>
          <Contents />
        </View>
      </ThemeProvider>
    </SandboxContent>
  )
}

const x = prepareContrastingValue({
  light: '#000000',
  dark: '#ffffff'
})

function Contents(): ReactNode {
  const { palette, spacing } = useThemeContext()
  return (
    <View>
      <View>
        <a>Anchor element</a>
        <span className={TemplateStyles.a}>Span as link</span>
      </View>
      <ul className={styles.ul}>
        {Object.keys(palette).map((key) => {
          const value = palette[key]
          const cssToken = `var(--${key})`
          return (
            <li
              key={key}
              style={{
                color: x(value),
                display: 'grid',
                gridAutoColumns: '1fr',
                gridAutoFlow: 'column',
                height: 48,
              }}
            >
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
            <li
              key={key}
              style={{
                display: 'grid',
                gridAutoColumns: '1fr',
                gridAutoFlow: 'column',
                paddingBottom: 10,
              }}
            >
              <View
                style={{
                  borderBlockEnd: 'solid 2px #ff0000',
                  width: value,
                  whiteSpace: 'nowrap',
                }}
              >
                <code>{`${key} · ${value}px`}</code>
              </View>
              <View
                style={{
                  borderBlockEnd: 'solid 2px #ff0000',
                  width: cssToken,
                  whiteSpace: 'nowrap',
                }}
              >
                <code>{cssToken}</code>
              </View>
            </li>
          )
        })}
      </ul>
    </View>
  )
}
