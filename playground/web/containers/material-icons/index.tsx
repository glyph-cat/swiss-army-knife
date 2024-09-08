/* eslint-disable import/no-deprecated */
import {
  loadMaterialIconStyleSheet,
  MaterialIcon,
  MATERIAL_ICON_DEFAULTS,
} from '../../../../src'

MATERIAL_ICON_DEFAULTS.variant = 'rounded'
loadMaterialIconStyleSheet(['rounded'])

export function MaterialIconsContainer(): JSX.Element {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MaterialIcon name='phone' />
    </div>
  )
}
