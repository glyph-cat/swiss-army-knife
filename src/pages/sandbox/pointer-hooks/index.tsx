import { useClickAwayListener, useMoveAwayListener, View } from '@glyph-cat/swiss-army-knife-react'
import { JSX, useReducer, useRef } from 'react'
import styles from './index.module.css'

const SIZE = 200 // px

const bumpReducer = (n: number) => n + 1

export default function (): JSX.Element {

  const [clickAwayCount, bumpClickAwayCount] = useReducer(bumpReducer, 0)
  const [moveAwayCount, bumpMoveAwayCount] = useReducer(bumpReducer, 0)

  const elementRef = useRef<View>(null)
  useClickAwayListener(() => {
    console.log('Clicked away', clickAwayCount)
    bumpClickAwayCount()
  }, elementRef)
  useMoveAwayListener(() => {
    console.log('Moved away', clickAwayCount)
    bumpMoveAwayCount()
  }, elementRef)

  return (
    <View className={styles.container}>
      <View className={styles.subContainer}>
        <View
          ref={elementRef}
          style={{
            backgroundColor: '#80808040',
            border: 'solid 1px #80808080',
            height: SIZE,
            width: SIZE,
          }}
        />
        <span>Click away count: {clickAwayCount}</span>
        <span>Move away count: {moveAwayCount}</span>
      </View>
    </View>
  )

}
