import {
  addStyles,
  clientOnly,
  PrecedenceLevel,
  StyleMap,
} from '@glyph-cat/swiss-army-knife'
import { prefixBasicUIIdentifiers } from 'packages/react/src/ui/basic/_internals/prefixing'

export const styles = prefixBasicUIIdentifiers('scrim', [
  'container',
  'dimLayer',
  'contentContainer',
])

export const animations = prefixBasicUIIdentifiers('scrim', [
  'in',
  'out',
])

clientOnly(() => {
  addStyles(new StyleMap([
    [`.${styles.container}`, {
      height: '100vh',
      left: 0,
      position: 'fixed',
      // KIV: is this still needed?
      // placeItems: 'center',
      top: 0,
      width: '100vw',
      zIndex: 1,
    }],
    [`.${styles.dimLayer}`, {
      backgroundColor: '#00000080',
      backdropFilter: 'blur(2px) grayscale(0.35)',
      height: '200vh',
      left: '-50vw',
      position: 'fixed',
      top: '-50vh',
      width: '200vw',
    }],
    [`.${styles.contentContainer}`, {
      placeSelf: 'center',
      // KIV: is this still needed?
      // zIndex: 1,
    }],
  ]).compile() + [
    `@keyframes ${animations.in}{0%{opacity:0}100%{opacity:1}}`,
    `@keyframes ${animations.out}{0%{opacity:1}100%{opacity:0}}`,
  ].join(''), PrecedenceLevel.INTERNAL)
})
