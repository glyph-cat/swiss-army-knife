import { Forward, View } from '@glyph-cat/swiss-army-knife-react'
import { ReactNode, useLayoutEffect, useRef } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

export default function (): ReactNode {
  const specialRef = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const target = specialRef.current
    console.log('target', target)
    if (!target) { return }
    const onClick = () => { console.log('clicked') }
    target.addEventListener('click', onClick)
    return () => { target.removeEventListener('click', onClick) }
  }, [])
  return (
    <SandboxContent className={styles.container}>
      <View>
        <Forward ref={specialRef}>
          <></>
          {/* <span>hello</span> */}
          {/* <span>world</span> */}
          hello world
          <></>
        </Forward>
        <span>not me</span>
      </View>
    </SandboxContent>
  )
}
