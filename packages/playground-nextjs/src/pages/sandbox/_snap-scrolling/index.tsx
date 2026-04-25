import { Charset } from '@glyph-cat/foundation'
import { HashFactory, prepareContrastingValue } from '@glyph-cat/swiss-army-knife'
import { View } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode, useLayoutEffect, useRef, useState } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

const TILE_HEIGHT = 300 // px
const TILE_WIDTH = 200 // px
const GAP_SIZE = 20 // px

const TILES_PER_VIEW = 5
const CONTAINER_WIDTH = TILE_WIDTH * TILES_PER_VIEW + GAP_SIZE * (TILES_PER_VIEW - 1) // px

const colors = (() => {
  const hashFactory = new HashFactory(6, Charset.HEX_UPPER)
  const arr: Array<string> = []
  for (let i = 0; i < 20; i++) {
    arr.push(`#${hashFactory.create().slice(0, 6)}`)
  }
  return arr
})()

const getContrastingColor = prepareContrastingValue({
  light: '#000000',
  dark: '#ffffff',
})

export default function (): ReactNode {

  const [snappedScrollPosition, setSnappedScrollPosition] = useState(0)

  const scrollContainerRef = useRef<View>(null)
  useLayoutEffect(() => {
    const target = scrollContainerRef.current
    const onScroll = (e) => {
      const offset = TILE_WIDTH + GAP_SIZE
      setSnappedScrollPosition(Math.floor(e.target.scrollLeft / offset) * offset)
    }
    target.addEventListener('scroll', onScroll)
    return () => { target.removeEventListener('scroll', onScroll) }
  }, [])

  return (
    <SandboxContent className={styles.container}>

      <View>

        <View
          ref={scrollContainerRef}
          style={{
            alignItems: 'center',
            border: 'solid 1px #80808080',
            gap: GAP_SIZE,
            gridAutoFlow: 'column',
            height: TILE_HEIGHT + GAP_SIZE * 2,
            overflow: 'scroll',
            scrollMarginInline: TILE_WIDTH + GAP_SIZE,
            scrollPaddingInline: (CONTAINER_WIDTH - TILE_WIDTH) / 2,
            scrollSnapType: 'x mandatory',
            width: CONTAINER_WIDTH,
          }}
        >
          {colors.map((color, index) => {
            return (
              <View
                key={index}
                onClick={() => {
                  // TODO: self scroll to center
                }}
                style={{
                  backgroundColor: color,
                  color: getContrastingColor(color),
                  borderRadius: 20,
                  height: TILE_HEIGHT,
                  placeItems: 'center',
                  scrollSnapAlign: 'center',
                  width: TILE_WIDTH,
                }}
              >
                <code style={{ textAlign: 'center', fontSize: '20pt' }}>
                  {color}
                </code>
              </View>
            )
          })}
        </View>

        {/* <View
          ref={scrollContainerRef}
          style={{
            border: 'solid 1px #80808080',
            height: TILE_HEIGHT + GAP_SIZE * 2,
            overflow: 'scroll',
            width: CONTAINER_WIDTH,
          }}
        >
          <View style={{ width: colors.length * TILE_WIDTH + (colors.length - 1) * GAP_SIZE }} />
        </View>

        <View
          onScroll={useCallback((e) => {
            e.preventDefault()
            // scrol
          }, [])}
          style={{
            // scrollsna
            backgroundColor: '#ff000040',
            height: TILE_HEIGHT + GAP_SIZE * 2,
            overflow: 'hidden',
            position: 'absolute',
            width: CONTAINER_WIDTH,
          }}
        >
          <View style={{
            alignItems: 'center',
            gap: GAP_SIZE,
            gridAutoFlow: 'column',
            marginInlineStart: -snappedScrollPosition,
            paddingInline: (CONTAINER_WIDTH - TILE_WIDTH) / 2,
          }}>
            {colors.map((color, index) => {
              return (
                <View key={index} style={{
                  backgroundColor: color,
                  color: getContrastingColor(color),
                  borderRadius: 20,
                  height: TILE_HEIGHT,
                  placeItems: 'center',
                  width: TILE_WIDTH,
                }}>
                  <code style={{ textAlign: 'center', fontSize: '20pt' }}>
                    {color}
                  </code>
                </View>
              )
            })}
          </View>
        </View> */}

      </View>

    </SandboxContent>
  )
}
