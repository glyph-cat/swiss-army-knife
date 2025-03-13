import { c, Empty } from '@glyph-cat/swiss-army-knife'
import {
  DisabledContext,
  DoNotRender,
  MaterialSymbol,
  MaterialSymbolName,
} from '@glyph-cat/swiss-army-knife-react'
import { useSimpleStateValue } from 'cotton-box-react'
import { JSX, MouseEvent, ReactNode, useCallback, useContext, useState } from 'react'
import { Code } from '~components/sandbox-extensions'
import { SandboxStyle } from '~constants'
import {
  Button,
  FocusLayer,
  GlobalLayeredFocusManager,
  View,
} from '~core-ui'
import styles from './index.module.css'

export default function (): JSX.Element {

  const [showCreatePopup, setCreatePopupVisibility] = useState(false)
  const onCreate = useCallback(() => { setCreatePopupVisibility(true) }, [])
  const hideCreatePopup = useCallback(() => { setCreatePopupVisibility(false) }, [])

  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>

      <DoNotRender>
        <pre>
          <code>
            {JSON.stringify(useSimpleStateValue(
              GlobalLayeredFocusManager.M$rootState
            ), null, 2)}
          </code>
        </pre>
      </DoNotRender>
      <View style={{ border: 'solid 1px #80808080' }}>
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
        <ContextVisualizer />
        {showCreatePopup && <FocusLayer>
          <View style={{
            border: 'solid 1px #80808080',
            margin: 20,
            padding: 20,
          }}>
            MockPopup
            <Button onClick={hideCreatePopup}>
              {'Dismiss popup'}
            </Button>
            <ContextVisualizer />
          </View>
        </FocusLayer>}
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

function ContextVisualizer(): JSX.Element {
  const context = useContext(
    GlobalLayeredFocusManager.M$context
  )
  return (
    <DoNotRender>
      <View>
        <pre>
          <code>
            {JSON.stringify(context, null, 2)}
            {/* <br />
          {'-'.repeat(30)}
          {JSON.stringify({
            'isNull(context.focusedChild)': isNull(context.focusedChild),
          }, null, 2)} */}
          </code>
        </pre>
      </View>
    </DoNotRender>
  )
}
