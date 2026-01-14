import { c } from '@glyph-cat/css-utils'
import { Empty } from '@glyph-cat/foundation'
import {
  ButtonBase as Button,
  CoreNavigationBranch,
  CoreNavigationBranchItem,
  CoreNavigationStack,
  CoreNavigationStackItem,
  DisabledContext,
  MaterialSymbol,
  MaterialSymbolName,
  useCoreNavigationBranch,
  View,
} from '@glyph-cat/swiss-army-knife-react'
import { JSX, MouseEvent, ReactNode, useCallback, useState } from 'react'
import { Code } from '~components/sandbox/extensions'
import { SandboxStyle } from '~constants'
import styles from './index.module.css'

export default function (): JSX.Element {

  const [showCreatePopup, setCreatePopupVisibility] = useState(false)
  const onCreate = useCallback(() => { setCreatePopupVisibility(true) }, [])
  const hideCreatePopup = useCallback(() => { setCreatePopupVisibility(false) }, [])
  const [showEditPopup, setEditPopupVisibility] = useState(false)
  const onEdit = useCallback(() => { setEditPopupVisibility(true) }, [])
  const hideEditPopup = useCallback(() => { setEditPopupVisibility(false) }, [])

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
                onClick={onEdit}
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
                The {'"Edit"'} button has <Code>{'disabled={false}'}</Code>, but will still become disabled if the layer loses focus.
              </li>
              <li>
                The {'"Custom 1"'} button does not have additional props either, but is wrapped with
                <Code>{'<DisabledContext disabled={true}>'}</Code> so it will always remain disabled.
              </li>
              <li>
                The {'"Custom 2"'} button is also wrapped in <Code>{'<DisabledContext disabled={true}>'}</Code>. However, it has a <Code>{'disabled={false}'}</Code> prop so it will remain enabled. Nonetheless, if the layer loses focus, it will still be disabled.
              </li>
            </ol>
            <Tabs />
            {showEditPopup && <CoreNavigationStackItem id='edit'>
              <View style={{
                border: 'solid 1px #80808080',
                margin: 20,
                padding: 20,
              }}>
                <h2>Edit</h2>
                <p>This mock popup is an <em>indirect</em> children of <Code>{'<CoreNavigationStackItem>'}</Code>.</p>
                <Button onClick={hideEditPopup}>
                  {'Dismiss popup'}
                </Button>
              </View>
            </CoreNavigationStackItem>}
          </CoreNavigationStackItem>

          {showCreatePopup && <CoreNavigationStackItem id='create'>
            <View style={{
              border: 'solid 1px #80808080',
              margin: 20,
              padding: 20,
            }}>
              <h2>Create</h2>
              <p>This mock popup is a direct children of <Code>{'<CoreNavigationStackItem>'}</Code>.</p>
              <Button onClick={hideCreatePopup}>
                {'Dismiss popup'}
              </Button>
            </View>
          </CoreNavigationStackItem>}

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

// #region Tabs

function Tabs(): JSX.Element {
  const [tabId, setTabId] = useState('tab-01')
  return (
    <View>
      <View>
        <Button onClick={useCallback(() => { setTabId('tab-01') }, [])}>Tab-01</Button>
        <Button onClick={useCallback(() => { setTabId('tab-02') }, [])}>Tab-02</Button>
        <Button onClick={useCallback(() => { setTabId('tab-03') }, [])}>Tab-03</Button>
      </View>
      <View>
        <CoreNavigationBranch focusedItem={tabId}>
          <CoreNavigationBranchItem id='tab-01'>
            <Tab>{'Tab 01'}</Tab>
          </CoreNavigationBranchItem>
          <CoreNavigationBranchItem id='tab-02'>
            <Tab>{'Tab 02'}</Tab>
          </CoreNavigationBranchItem>
          <CoreNavigationBranchItem id='tab-03'>
            <Tab>{'Tab 03'}</Tab>
          </CoreNavigationBranchItem>
        </CoreNavigationBranch>
      </View>
    </View>
  )
}

interface TabProps {
  children: ReactNode
}

function Tab({
  children,
}: TabProps): JSX.Element {
  const { isFocused } = useCoreNavigationBranch()
  return (
    <View>
      {children}
      {' - '}
      {isFocused ? 'Focused' : 'Not focused'}
    </View>
  )
}

// #endregion Tabs
