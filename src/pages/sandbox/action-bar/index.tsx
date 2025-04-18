import { c, Empty } from '@glyph-cat/swiss-army-knife'
import {
  ButtonBase as Button,
  CoreNavigationStack,
  CoreNavigationStackItem,
  DisabledContext,
  MaterialSymbol,
  MaterialSymbolName,
  View,
} from '@glyph-cat/swiss-army-knife-react'
import { JSX, MouseEvent, ReactNode, useCallback, useState } from 'react'
import { Code } from '~components/sandbox-extensions'
import { SandboxStyle } from '~constants'
import styles from './index.module.css'

export default function (): JSX.Element {

  const [showCreatePopup, setCreatePopupVisibility] = useState(false)
  const onCreate = useCallback(() => { setCreatePopupVisibility(true) }, [])
  const hideCreatePopup = useCallback(() => { setCreatePopupVisibility(false) }, [])

  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>
      <View style={{ border: 'solid 1px #80808080' }}>
        <CoreNavigationStack>

          <CoreNavigationStackItem id='main'>
            <ActionBar>
              <ActionBarButton
                icon='add'
                label={'Create'}
                onClick={onCreate}
              />
              <ActionBarButton
                icon='edit'
                label={'Edit'}
                onClick={Empty.FUNCTION}
                disabled={false}
              />
              <DisabledContext disabled={true}>
                <ActionBarButton
                  icon='pending'
                  label={'Custom 1'}
                  onClick={Empty.FUNCTION}
                />
                <ActionBarButton
                  icon='pending'
                  label={'Custom 2'}
                  onClick={Empty.FUNCTION}
                  disabled={false}
                />
              </DisabledContext>
            </ActionBar>
            <ol>
              <li>
                The {'"Create"'} button is the most common scenario, with no additional props.
              </li>
              <li>
                The {'"Edit"'} button has <Code>{'disabled={false}'}</Code>, but will still remain disabled if the layer loses focus.
              </li>
              <li>
                The {'"Custom 1"'} button does not have additional props either, but is wrapped with
                <Code>{'<DisabledContext disabled={true}>'}</Code> so it will always remain disabled.
              </li>
              <li>
                The {'"Custom 2"'} button, however, has a <Code>{'disabled={false}'}</Code> prop so it will remain enabled even when wrapped in <Code>{'<DisabledContext disabled={true}>'}</Code>. Nonetheless, if the layer loses focus, it will still be disabled.
              </li>
            </ol>
            {showCreatePopup && <CoreNavigationStackItem id='popup'>
              <View style={{
                border: 'solid 1px #80808080',
                margin: 20,
                padding: 20,
              }}>
                MockPopup
                <Button onClick={hideCreatePopup}>
                  {'Dismiss popup'}
                </Button>
              </View>
            </CoreNavigationStackItem>}
          </CoreNavigationStackItem>
        </CoreNavigationStack>

      </View>
    </View>
  )
}

// #region Action Bar

export interface ActionBarProps {
  children: ReactNode
}

export function ActionBar({
  children,
}: ActionBarProps): JSX.Element {
  return (
    <View className={styles.actionBar}>
      {children}
    </View>
  )
}

export interface ActionBarButtonProps {
  icon: MaterialSymbolName
  label: string
  onClick(event: MouseEvent<HTMLButtonElement>): void
  visible?: boolean
  disabled?: boolean
}

export function ActionBarButton({
  icon,
  label,
  onClick,
  visible = true,
  disabled,
}: ActionBarButtonProps): JSX.Element {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      style={visible ? {} : { display: 'none' }}
    >
      <MaterialSymbol name={icon} />
      {label}
    </Button>
  )
}

// #endregion Action Bar
