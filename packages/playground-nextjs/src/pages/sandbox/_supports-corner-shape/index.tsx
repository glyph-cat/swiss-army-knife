import { addStyles, PrecedenceLevel, StyleMap } from '@glyph-cat/css-utils'
import { View } from '@glyph-cat/swiss-army-knife-react'
import { STYLE_NONE } from 'packages/react/src/styling/constants'
import { Surface } from 'packages/react/src/ui/basic/surface'
import { ReactNode } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

function supportsCornerShape(): boolean {
  const PROBE_ELEMENT_CLASSNAME = 'probe-supports-corner-shape'
  const CORNER_SHAPE_SUPERELLIPSE_1 = '(corner-shape: superellipse(1))'
  const STYLES_IF_SUPPORTED = new StyleMap([[`.${PROBE_ELEMENT_CLASSNAME}`, { zIndex: 1 }]]).compile()
  const STYLES_IF_UNSUPPORTED = new StyleMap([[`.${PROBE_ELEMENT_CLASSNAME}`, { zIndex: 0 }]]).compile()
  const removeProbeStyles = addStyles([
    `@supports ${CORNER_SHAPE_SUPERELLIPSE_1}{${STYLES_IF_SUPPORTED}}`,
    `@supports not ${CORNER_SHAPE_SUPERELLIPSE_1}{${STYLES_IF_UNSUPPORTED}}`,
  ].join(' '), PrecedenceLevel.INTERNAL)
  const probeElement = document.createElement('div')
  probeElement.classList.add(PROBE_ELEMENT_CLASSNAME)
  probeElement.style.display = STYLE_NONE
  document.body.append(probeElement)
  const computedStyle = getComputedStyle(probeElement)
  const isSupported = computedStyle.zIndex === '1'
  probeElement.remove()
  removeProbeStyles()
  return isSupported
}

export default function (): ReactNode {
  return (
    <SandboxContent className={styles.container}>
      <p>
        This browser supports <code>corner-shape</code>: {supportsCornerShape() ? 'Yes' : 'No'}
      </p>
      <View style={{ padding: 20 }}>
        <Surface>
          {'Hello world'}
        </Surface>
      </View>
    </SandboxContent>
  )
}
