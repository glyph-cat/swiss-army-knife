import { c, Empty } from '@glyph-cat/swiss-army-knife'
import { DoNotRender } from '@glyph-cat/swiss-army-knife-react'
import { useSimpleStateValue } from 'cotton-box-react'
import { JSX, MouseEvent, ReactNode, useCallback, useContext, useState } from 'react'
import { SandboxStyle } from '~constants'
import { Button, FocusLayer, GlobalDisabledContext, GlobalLayeredFocusManager, View } from '~core-ui'
import { MaterialSymbol, MaterialSymbolName } from '~unstable/material-symbols'
import styles from './index.module.css'

export default function (): JSX.Element {

  const [showCreatePopup, setCreatePopupVisibility] = useState(false)

  const onCreate = useCallback(() => {
    setCreatePopupVisibility(true)
  }, [])


  const hideCreatePopup = useCallback(() => {
    setCreatePopupVisibility(false)
  }, [])

  return (
    <View className={c(SandboxStyle.NORMAL, styles.container)}>

      <DoNotRender>
        <pre>
          <code>
            {JSON.stringify(useSimpleStateValue(
              // @ts-expect-error because we want to spy on the root state
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
          <GlobalDisabledContext.Provider disabled={true}>
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
          </GlobalDisabledContext.Provider>
        </ActionBar>
        <p>
          <ol>
            <li>
              The {'"Create"'} button is the most common scenario, with no additional props.
            </li>
            <li>
              The {'"Edit"'} button has <code>{'disabled={false}'}</code>, but will still remain disabled if the layer loses focus.
            </li>
            <li>
              The {'"Custom 1"'} button does not have additional props either, but is wrapped with
              <code>{'<DisabledContext disabled={true}>'}</code> so it will always remain disabled.
            </li>
            <li>
              The {'"Custom 2"'} button, however, has a <code>{'disabled={false}'}</code> prop so it will remain enabled even when wrapped in <code>{'<DisabledContext disabled={true}>'}</code>. Nonetheless, if the layer loses focus, it will still be disabled.
            </li>
          </ol>
        </p>
        <ContextVisualizer />
      </View>
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
  )
}

function ContextVisualizer(): JSX.Element {
  const context = useContext(
    // @ts-expect-error because we want to spy on the context
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
