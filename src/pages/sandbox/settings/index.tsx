import { c } from '@glyph-cat/swiss-army-knife'
import { RadioGroup, RadioItem, View } from '@glyph-cat/swiss-army-knife-react'
import { useStateValue } from 'cotton-box-react'
import { JSX, useCallback } from 'react'
import { SandboxStyle } from '~constants'
import { useLocalization } from '~services/localization'
import { ThemeState, ThemeStateValue } from '~services/theme'
import { ThemeId } from '~services/theme/abstractions'
import { UserPreferencesState } from '~services/user-preferences'
import { IUserPreferences } from '~services/user-preferences/abstractions'
import styles from './index.module.css'

export default function (): JSX.Element {

  const { localize, language } = useLocalization()

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
        onChange={useCallback((newValue: IUserPreferences['language']) => {
          UserPreferencesState.set((prevState) => ({
            ...prevState,
            language: newValue,
          }))
        }, [])}
      >
        <RadioItem value={null} disabled>{'Automatic'}</RadioItem>
        <RadioItem value={'en'}>{'English'}</RadioItem>
        <RadioItem value={'zh'}>{'中文'}</RadioItem>
      </RadioGroup>

    </View>
  )
}
