import { c, isNull } from '@glyph-cat/swiss-army-knife'
import { RadioGroup, RadioItem, View } from '@glyph-cat/swiss-army-knife-react'
import { useSimpleStateValue, useStateValue } from 'cotton-box-react'
import { JSX, useCallback } from 'react'
import { SandboxStyle } from '~constants'
import { GlobalLocalizationContext, useLocalization } from '~services/localization'
import { ThemeState, ThemeStateValue } from '~services/theme'
import { ThemeId } from '~services/theme/abstractions'
import styles from './index.module.css'

function onSetLanguage(language: any): void {
  if (isNull(language)) {
    GlobalLocalizationContext.autoSetLanguage(null) // todo
  } else {
    GlobalLocalizationContext.setLanguage(language)
  }
}

export default function (): JSX.Element {

  const themeState = useStateValue(ThemeState, (s) => {
    if (s.auto) {
      return 'AUTO'
    } else if (s.id === ThemeId.DEFAULT_LIGHT) {
      return 'LIGHT'
    } else if (s.id === ThemeId.DEFAULT_DARK) {
      return 'DARK'
    }
    return null
  })

  const { localize } = useLocalization()

  const language = useSimpleStateValue(
    GlobalLocalizationContext.state,
    (s) => s.auto ? null : s.language,
  )

  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>

      <RadioGroup
        value={themeState}
        onChange={useCallback((key: keyof typeof ThemeStateValue) => {
          ThemeState.set(ThemeStateValue[key])
        }, [])}
      >
        <RadioItem value='AUTO'>{localize('AUTOMATIC')}</RadioItem>
        <RadioItem value='LIGHT'>{localize('THEME_LIGHT')}</RadioItem>
        <RadioItem value='DARK'>{localize('THEME_DARK')}</RadioItem>
      </RadioGroup>

      <RadioGroup
        value={language}
        onChange={onSetLanguage}
      >
        <RadioItem value={null}>{'Automatic'}</RadioItem>
        <RadioItem value={'en'}>{'English'}</RadioItem>
        <RadioItem value={'zh'}>{'中文'}</RadioItem>
      </RadioGroup>

    </View >
  )
}
