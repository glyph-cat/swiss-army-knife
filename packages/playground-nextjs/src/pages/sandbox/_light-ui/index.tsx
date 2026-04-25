import { injectInlineCSSVariables } from '@glyph-cat/css-utils'
import { Value2D } from '@glyph-cat/foundation'
import {
  getAngleFromPointsIn2D,
  getDistance2DByCoordinates,
  LinearEquation2D,
  radToDeg,
  RectangularBoundary,
} from '@glyph-cat/swiss-army-knife'
import { ButtonBase, ButtonBaseProps, View } from '@glyph-cat/swiss-army-knife-react'
import clsx from 'clsx'
import { SimpleStateManager } from 'cotton-box'
import { useSimpleStateValue } from 'cotton-box-react'
import { ReactNode, startTransition, useEffect, useRef, useState } from 'react'
import { SandboxContent } from '~components/sandbox/content'
import styles from './index.module.css'

const PointerPositionState = new SimpleStateManager<Value2D>({
  x: 0,
  y: 0,
})

const { ƒ: mapOutlineOpacity } = LinearEquation2D.fromPoints(
  { x: 500, y: 0.65 },
  { x: 0, y: 1 },
)

export default function (): ReactNode {

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      PointerPositionState.set({
        x: e.clientX,
        y: e.clientY,
      })
    }
    window.addEventListener('pointermove', onPointerMove)
    return () => { window.removeEventListener('pointermove', onPointerMove) }
  }, [])

  return (
    <SandboxContent className={styles.container}>
      <View className={styles.subContainer}>
        <TestButton>{'7'}</TestButton>
        <TestButton>{'8'}</TestButton>
        <TestButton>{'9'}</TestButton>
        <TestButton>{'4'}</TestButton>
        <TestButton>{'5'}</TestButton>
        <TestButton>{'6'}</TestButton>
        <TestButton>{'1'}</TestButton>
        <TestButton>{'2'}</TestButton>
        <TestButton>{'3'}</TestButton>
        <TestButton>{'-'}</TestButton>
        <TestButton>{'0'}</TestButton>
        <TestButton>{'.'}</TestButton>
      </View>
    </SandboxContent>
  )

}

type TestButtonProps = ButtonBaseProps

function TestButton({
  children,
  className,
  ...props
}: TestButtonProps): ReactNode {

  const buttonRef = useRef<ButtonBase>(null)

  const [position, setPosition] = useState<Value2D>({
    x: 0,
    y: 0,
  })
  useEffect(() => {
    const target = buttonRef.current
    if (!target) { return } // Early exit
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        const { contentRect } = entries[0]
        const bounds = target.getBoundingClientRect() as RectangularBoundary
        startTransition(() => {
          setPosition({
            x: bounds.left + (contentRect.width / 2),
            y: bounds.top + (contentRect.height / 2),
          })
        })
      }
    })
    resizeObserver.observe(target)
    return () => { resizeObserver.disconnect() }
  }, [])

  const pointerPosition = useSimpleStateValue(PointerPositionState)

  const angle = radToDeg(getAngleFromPointsIn2D(
    position,
    { ...position, y: 0 },
    position,
    pointerPosition,
  ))

  useEffect(() => {
    const target = buttonRef.current
    if (!target) { return } // Early exit
    const outlineGradient = `linear-gradient(${angle}deg, #80808040 0%, #80808080 95%, #ffffff80 100%)`
    const outlineOpacity = Math.max(mapOutlineOpacity(getDistance2DByCoordinates(position, pointerPosition)), 0.5)
    const shadowValue = '0px 2px 3px 0px #00000080' // TODO: how to calculate this?
    return injectInlineCSSVariables({
      outlineGradient,
      outlineOpacity,
      shadowValue,
    }, target)
  }, [angle, pointerPosition, position])

  return (
    <>
      <ButtonBase
        ref={buttonRef}
        className={clsx(styles.button, className)}
        {...props}
      >
        {children}
        {/* {angle}
        <br />
        {JSON.stringify({
          x: Math.round(pointerPosition.x),
          y: Math.round(pointerPosition.y),
        })} */}
      </ButtonBase>
      {/* <View style={{
        backgroundColor: '#ff0000',
        width: 2,
        height: 300,
        position: 'fixed',
        placeSelf: 'center',
        top: '50%',
        left: '50%',
        transform: `rotateZ(${angle}deg)`,
      }} />
      <View style={{
        height: 10,
        width: 10,
        borderRadius: 10,
        position: 'fixed',
        left: position.x,
        top: position.y,
        marginLeft: -5,
        marginTop: -5,
        zIndex: 1,
        backgroundColor: '#2b80ff',
      }} /> */}
    </>
  )

}
