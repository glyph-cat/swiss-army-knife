import { addStyles, PrecedenceLevel, StyleMap, ThemeToken } from '@glyph-cat/swiss-army-knife'
import { JSX, ReactNode } from 'react'
import { STYLE_NONE } from '../../../styling/constants'
import { SmartView } from '../../core'

// EXPERIMENTAL!!!

export interface SurfaceProps {
  children?: ReactNode
  borderRadius?: number
  superEllipse?: number
}

export function Surface({
  children,
  borderRadius = 10,
  superEllipse = 2,
}: SurfaceProps): JSX.Element {
  return (
    <SmartView
      style={{
        // @ts-expect-error because `corner-shape` is not (yet) a standard property.
        cornerShape: `superellipse(${superEllipse})`,
        backgroundColor: '#80808040',
        border: 'solid 1px #80808080',
        borderRadius: supportsCornerShape() ? borderRadius * 2 : borderRadius,
        padding: ThemeToken.spacingM,
      }}
    >
      {children}
    </SmartView>
  )
}

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
