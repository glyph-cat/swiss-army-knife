/* eslint-disable import/no-deprecated */
import { AppRegistry, View } from 'react-native'
// import { clamp } from '../../src'
import { MaterialIcon, MATERIAL_ICON_DEFAULTS } from '../../src'

// function PlaygroundNative(): JSX.Element {
//   return (
//     <View style={{ backgroundColor: '#111111', flex: 1, height: '100%', width: '100%' }}>
//       <Text style={{ color: '#B5B5B5', fontSize: 72, fontWeight: 'bold' }}>
//         {'Hello World'}
//         {'\n'}
//         clamp(2, 5, 10) = {clamp(2, 5, 10)}
//       </Text>
//     </View>
//   )
// }

MATERIAL_ICON_DEFAULTS.variant = 'rounded'

function PlaygroundNative(): JSX.Element {
  return (
    <View style={{ flex: 1, height: '100%', width: '100%' }}>
      <MaterialIcon name='phone' />
    </View>
  )
}

// NOTE: It seems like the `appKey` parameter must be the same as project name
// when calling `react-native init`. If the project directory name or names in
// `app.json` changes, the `appKey` must remain the same. In this case it's
// value is 'playground'.
AppRegistry.registerComponent('playground', () => PlaygroundNative)
