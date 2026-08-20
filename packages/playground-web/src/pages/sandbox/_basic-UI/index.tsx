import { ThemeToken } from '@glyph-cat/swiss-army-knife'
import {
  Checkbox,
  ProgressBar,
  ProgressRing,
  SegmentedSelection,
  SegmentedSelectionItem,
  Switch,
  View,
} from '@glyph-cat/swiss-army-knife-react'
import { ReactNode, useCallback, useState } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuSeparator,
  MenuTrigger,
} from '~unstable/basic-ui'
import { ButtonVariation } from './components/button-variation'
import { CheckboxVariation } from './components/checkbox-variation'
import { DEMO_RADIO_ITEMS, RadioVariation } from './components/radio-variation'
import { SwitchVariation } from './components/switch-variation'
import { TESTING } from './constants'
import styles from './index.module.css'

export default function (): ReactNode {

  const [switchOn, setSwitchState] = useState(false)

  const [tempSegmentedSelectionValue, setTempSegmentedSelectionValue] = useState(1)

  return (

    <SandboxContent className={styles.container}>

      <View className={styles.subContainer}>
        <h1 className={styles.title}>{'RadioGroup'}</h1>
        <RadioVariation />
        <RadioVariation color='#ff2b80' />
        <RadioVariation flow='column' />
        <RadioVariation itemFlow='row' />
        <RadioVariation position='end' />
        <RadioVariation itemFlow='row' position='end' />
        <RadioVariation position='end' value={DEMO_RADIO_ITEMS.at(-1)!.id} />
      </View>

      <View className={styles.subContainer}>
        <h1 className={styles.title}>{'SegmentedSelection'}</h1>
        <View style={{ width: 500 }}>
          <SegmentedSelection
            value={tempSegmentedSelectionValue}
            onChange={setTempSegmentedSelectionValue}
          >
            <SegmentedSelectionItem value={1}>
              {'I'}
            </SegmentedSelectionItem>
            <SegmentedSelectionItem value={2}>
              {'II'}
            </SegmentedSelectionItem>
            <SegmentedSelectionItem value={3}>
              {'III'}
            </SegmentedSelectionItem>
            <SegmentedSelectionItem value={4}>
              {'IV'}
            </SegmentedSelectionItem>
            <SegmentedSelectionItem value={5}>
              {'V'}
            </SegmentedSelectionItem>
          </SegmentedSelection>
        </View>
      </View>

      <View className={styles.subContainer}>
        <h1 className={styles.title}>{'Switch'}</h1>

        <View style={{
          gap: 100,
          gridTemplateColumns: 'repeat(2, auto) 1fr',
        }}>

          <View style={{ gap: ThemeToken.spacingM }}>
            <SwitchVariation value={false} />
            <SwitchVariation value={false} disabled />
            <SwitchVariation value={false} busy />
            <SwitchVariation value={true} />
            <SwitchVariation value={true} disabled />
            <SwitchVariation value={true} busy />
            <SwitchVariation value={false} color='success' />
            <SwitchVariation value={true} color='success' />
            <SwitchVariation value={false} color='#ff2b80' />
            <SwitchVariation value={true} color='#ff2b80' />
            <SwitchVariation rtl />
          </View>

          <View className={styles.positionVariationContainer}>
            <View>
              <Switch
                value={switchOn}
                position='start'
                onChange={useCallback((s: boolean) => { setSwitchState(s) }, [])}
              >
                {TESTING}
              </Switch>
            </View>
            <View>
              <Switch
                value={switchOn}
                onChange={useCallback((s: boolean) => { setSwitchState(s) }, [])}
              />
            </View>
            <View style={{ direction: 'rtl' }}>
              <Switch
                value={switchOn}
                position='end'
                onChange={useCallback((s: boolean) => { setSwitchState(s) }, [])}
              >
                {TESTING}
              </Switch>
            </View>
          </View>

        </View>

      </View>

      <View className={styles.subContainer}>
        <h1 className={styles.title}>{'BasicButton'}</h1>
        <ButtonVariation template='icon' />
        <ButtonVariation />
        <ButtonVariation color='primary' />
        <ButtonVariation disabled />
        <ButtonVariation busy />
        <ButtonVariation color='success' />
        <ButtonVariation color='#ff2b80' />
      </View>

      <View className={styles.subContainer}>
        <h1 className={styles.title}>{'Menu'}</h1>
        <View style={{ justifyItems: 'start' }}>
          <Menu>
            <MenuTrigger>
              <View style={{
                backgroundImage: 'url("/assets/hibiscus.jpg")',
                backgroundSize: 'cover',
                height: 100,
                width: 100,
              }} />
            </MenuTrigger>
            <MenuPopover triggerEvent='contextmenu'>
              <MenuList>
                <MenuItem>{'Select'}</MenuItem>
                <MenuItem disabled>{'Deselect'}</MenuItem>
                <MenuSeparator />
                <MenuItem>{'Crop'}</MenuItem>
                <MenuItem>{'Resize'}</MenuItem>
                <MenuSeparator />
                <MenuItem>{'Lookup'}</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </View>
      </View>

      <View className={styles.subContainer}>
        <h1 className={styles.title}>{'Checkbox'}</h1>

        <View style={{
          gap: 100,
          gridTemplateColumns: 'repeat(2, auto) 1fr'
        }}>

          <View style={{ gap: ThemeToken.spacingM }}>
            <CheckboxVariation value={false} />
            <CheckboxVariation value={false} disabled />
            <CheckboxVariation value={false} busy />
            <CheckboxVariation value='indeterminate' />
            <CheckboxVariation value='indeterminate' disabled />
            <CheckboxVariation value={true} />
            <CheckboxVariation value={true} disabled />
            <CheckboxVariation value={true} busy />
            <CheckboxVariation value={false} color='success' />
            <CheckboxVariation value={true} color='success' />
            <CheckboxVariation value={false} color='#ff2b80' />
            <CheckboxVariation value={true} color='#ff2b80' />
            <CheckboxVariation rtl />
          </View>

          <View className={styles.positionVariationContainer}>
            <View />
            <View>
              <Checkbox flow='row' position='start'>{TESTING}</Checkbox>
            </View>
            <View />
            <View>
              <Checkbox flow='column' position='start'>{TESTING}</Checkbox>
            </View>
            <View>
              <Checkbox />
            </View>
            <View>
              <Checkbox flow='column' position='end'>{TESTING}</Checkbox>
            </View>
            <View />
            <View>
              <Checkbox flow='row' position='end'>{TESTING}</Checkbox>
            </View>
            <View />
          </View>

        </View>

      </View>

      <View style={{
        gap: ThemeToken.spacingM,
        gridAutoFlow: 'column',
        gridTemplateColumns: '1fr auto',
      }}>

        <View className={styles.subContainer}>
          <h1 className={styles.title}>{'ProgressBar'}</h1>
          <View style={{
            gap: ThemeToken.spacingM,
            gridTemplateColumns: '1fr auto',
            gridAutoFlow: 'column',
          }}>
            <View style={{ gap: ThemeToken.spacingM }}>
              <ProgressBar value={33} size='s' />
              <ProgressBar value={33} size='m' />
              <ProgressBar value={100} size='l' />
              <ProgressBar value={99} size={32} borderRadius='42%' color='#ff2b80' />
              <ProgressBar value={17} color='#ffaa80' reverse />
              <ProgressBar />
              <ProgressBar size={64} reverse />
            </View>
            <View style={{
              gap: ThemeToken.spacingM,
              gridAutoFlow: 'column',
              gridAutoColumns: 'max-content',
            }}>
              <ProgressBar value={33} size='s' layout='vertical' />
              <ProgressBar value={50} size='m' layout='vertical' />
              <ProgressBar value={66} size='l' layout='vertical' />
              <ProgressBar value={99} size={32} layout='vertical' borderRadius='50%' color='#ff2b80' />
              <ProgressBar value={17} layout='vertical' color='#ffaa80' reverse />
              <ProgressBar layout='vertical' />
              <ProgressBar size={32} layout='vertical' reverse />
            </View>
          </View>
        </View>

        <View className={styles.subContainer}>
          <h1 className={styles.title}>{'ProgressRing'}</h1>
          <View style={{
            gap: ThemeToken.spacingM,
            gridTemplateColumns: 'repeat(3, 100px)',
            placeItems: 'center',
          }}>
            <ProgressRing value={37} size='s' />
            <ProgressRing value={37} size='m' />
            <ProgressRing value={37} size='l' />
            <ProgressRing value={37} size='s' thickness={3} color='info' />
            <ProgressRing value={37} size='m' thickness={10} color='#ff2b80' />
            <ProgressRing value={37} size='l' thickness={24} color='#ffaa80' />
            <ProgressRing value={37} size={64} />
            <ProgressRing />
            <ProgressRing value={137} thickness={10} allowOvershoot />
          </View>
        </View>

      </View>

    </SandboxContent>
  )
}
