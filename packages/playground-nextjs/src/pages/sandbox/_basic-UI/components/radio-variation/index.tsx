import { LocalizationKey } from '@glyph-cat/localization'
import { RadioGroup, RadioGroupProps, RadioItem } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode, useState } from 'react'
import { GlobalDictionary, useLocalization } from '~services/localization'
import { UI_SIZES } from '../../constants'
import { VariationDisplayContainer } from '../variation-display-container'

export interface IDemoRadioItem {
  id: number
  name: LocalizationKey<typeof GlobalDictionary.data>
}

export const DEMO_RADIO_ITEMS: Array<IDemoRadioItem> = [
  { id: 1, name: 'FLAVOR_CHOCOLATE_MINT' },
  { id: 2, name: 'FLAVOR_STRAWBERRY' },
  { id: 3, name: 'FLAVOR_COOKIES_AND_CREAM' },
  { id: 4, name: 'FLAVOR_DURIAN' },
] as const

export interface RadioVariationProps extends Omit<RadioGroupProps<IDemoRadioItem['id']>, 'value' | 'onChange'> {
  rtl?: boolean
  value?: IDemoRadioItem['id']
}

export function RadioVariation({
  rtl,
  ...props
}: RadioVariationProps): ReactNode {
  const { localize } = useLocalization()
  const [states, setStates] = useState(UI_SIZES.map(() => props.value ?? DEMO_RADIO_ITEMS[0].id))
  const flow = props.flow ?? 'row' // default value
  return (
    <VariationDisplayContainer
      style={{
        ...(flow !== 'column' ? { alignItems: 'start' } : {}),
        ...(flow !== 'row' ? { gridAutoFlow: 'row' } : {}),
        ...(rtl ? { direction: 'rtl' } : {}),
      }}
    >
      {UI_SIZES.map((size, index) => {
        return (
          <RadioGroup
            {...props}
            key={size}
            value={states[index]}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={(newValue) => {
              setStates((s) => {
                const nextState = [...s]
                nextState.splice(index, 1, newValue)
                return nextState
              })
            }}
            size={size}
          >
            {DEMO_RADIO_ITEMS.map((item) => {
              return (
                <RadioItem
                  key={item.id}
                  value={item.id}
                  {...item.id === 4 ? { disabled: true } : {}}
                >
                  {localize(item.name)}
                </RadioItem>
              )
            })}
          </RadioGroup>
        )
      })}
    </VariationDisplayContainer>
  )
}
