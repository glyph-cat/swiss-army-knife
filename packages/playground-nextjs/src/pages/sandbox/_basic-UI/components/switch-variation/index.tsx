import { Switch, SwitchProps } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode, useState } from 'react'
import { TESTING, TESTING_RTL, UI_SIZES } from '../../constants'
import { VariationDisplayContainer } from '../variation-display-container'

export interface SwitchVariationProps extends Omit<SwitchProps, 'size'> {
  rtl?: boolean
}

export function SwitchVariation({
  rtl,
  ...props
}: SwitchVariationProps): ReactNode {
  const [states, setStates] = useState(UI_SIZES.map(() => props.value))
  return (
    <VariationDisplayContainer style={rtl ? { direction: 'rtl' } : {}}>
      {UI_SIZES.map((size, index) => {
        return (
          <Switch
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
            {rtl ? TESTING_RTL : TESTING}
          </Switch>
        )
      })}
    </VariationDisplayContainer>
  )
}
