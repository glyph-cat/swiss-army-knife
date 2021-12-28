/* eslint-disable */

import { Animated } from 'react-native'
import { EMPTY_FUNCTION } from '../../../data/dummies'
import { MaterialIconProps } from './schema'
import {
  MATERIAL_ICON_DEFAULT_SIZE,
  MATERIAL_ICON_DEFAULT_VARIANT,
} from './__shared__'

/**
 * @public
 */
export function MaterialIcon({
  name,
  size = MATERIAL_ICON_DEFAULT_SIZE,
  variant = MATERIAL_ICON_DEFAULT_VARIANT,
  nativeProps = {},
}: MaterialIconProps): JSX.Element {
  throw new Error(
    'The <MaterialIcon/> component does not support React Native yet.'
  )
  const { style, ...remainingNativeProps } = nativeProps
  return (
    <Animated.Text
      style={{
        fontSize: size as number,
        fontFamily: '', // TODO
        ...style as Record<string, unknown>,
      }}
      {...remainingNativeProps}
    >
      {name}
    </Animated.Text>
  )
}

/**
 * @public
 */
export const loadMaterialIconStyleSheets = EMPTY_FUNCTION

/**
 * @public
 */
export const useMaterialIconStyleSheet = EMPTY_FUNCTION

/**
 * @public
 */
export function MaterialIconStyleSheet(): JSX.Element {
  return null
}
