import { objectIsShallowEqual } from '@glyph-cat/equality'
import {
  CleanupFunction,
  EmptyFunction,
  LenientString,
  Nullable,
  PartialRecord,
  StringRecord,
  TypedFunction,
} from '@glyph-cat/foundation'
import { devError, IS_DEBUG_ENV, Key, objectReduce } from '@glyph-cat/swiss-army-knife'
import { isFunction, isNullOrUndefined } from '@glyph-cat/type-checking'
import {
  createContext,
  Dispatch,
  JSX,
  ReactElement,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { __getDisplayName, __setDisplayName } from '../_internals'
import { GenericHTMLProps } from '../abstractions'
import { useMemoAlt } from '../hooks/memo-alt'

interface ITriggerContext<T> {
  trigger: T
  setTrigger: Dispatch<SetStateAction<Nullable<T>>>
}

const TriggerContext = createContext<Nullable<ITriggerContext<unknown>>>(null)

function useTriggerContext<T>(): ITriggerContext<T> {
  const triggerContext = useContext(TriggerContext)
  if (IS_DEBUG_ENV && !triggerContext) {
    devError(`${__getDisplayName(TriggerSpawn)} must be a children of ${__getDisplayName(Trigger)}`)
  }
  return triggerContext as ITriggerContext<T>
}

export interface Trigger {
  Target(): JSX.Element
  Spawn(): JSX.Element
}

export interface TriggerProps {
  children?: ReactNode
}

export function Trigger({
  children,
}: TriggerProps): JSX.Element {
  const [trigger, setTrigger] = useState<unknown>(null)
  const contextValue = useMemo(() => ({
    trigger,
    setTrigger,
  }), [trigger])
  return (
    <TriggerContext value={contextValue}>
      {children}
    </TriggerContext>
  )
}

export interface TriggerTargetProps {
  children?: ReactNode
}

function TriggerTarget({
  children,
}: TriggerTargetProps): JSX.Element {
  const { setTrigger } = useTriggerContext<HTMLElement>()
  const {
    type: Component,
    props: { ref, ...props },
    key,
  } = children as ReactElement<GenericHTMLProps>
  return (
    <Component
      ref={useCallback((node: HTMLElement) => {
        let cleanupRef: CleanupFunction
        setTrigger(node)
        if (ref) {
          if (isFunction(ref)) {
            cleanupRef = (ref(node) as TypedFunction) ?? (() => { ref(null) })
          } else {
            // eslint-disable-next-line react-hooks/immutability
            ref.current = node
            cleanupRef = () => { ref.current = null }
          }
        }
        return () => {
          setTrigger(null)
          cleanupRef?.()
        }
      }, [ref, setTrigger])}
      {...props as StringRecord}
      {...(isNullOrUndefined(key) ? {} : { key })}
    />
  )
}

__setDisplayName(TriggerTarget)
Trigger.Target = TriggerTarget

export type KeyCombination = [
  key: string,
  ...modifiers: Array<LenientString<Key>>
]

enum PointerEvent {
  CLICK,
  DOUBLE_CLICK,
  RIGHT_CLICK,
  WHEEL,
  // LONG_PRESS, // but for how long
}

export type PointerCombination = [
  key: PointerEvent,
  ...modifiers: Array<LenientString<Key>>
]

export interface TriggerSpawnProps extends PartialRecord<keyof HTMLElementEventMap, boolean> {
  children?: ReactNode
  // keys?: Array<string | KeyCombination>
  // pointers?: Array<PointerEvent | PointerCombination>
  // ^ This is actually weird because with a different modifier,
  //   something different should have been triggered.
}

function TriggerSpawn({
  children,
  ...$events
}: TriggerSpawnProps): ReactNode {
  const { trigger } = useTriggerContext<HTMLElement>()
  const [shouldShowContent, setContentVisibility] = useState(false)
  const events = useMemoAlt(() => {
    return $events
  }, [$events], ([prevEvents], [nextEvents]) => {
    // NOTE: `events` need to be memoized with a special equality comparator
    // or else it would cause infinite rendering.
    return objectIsShallowEqual(prevEvents, nextEvents)
  })
  useEffect(() => {
    if (!trigger) { return } // Early exit
    const handlers = objectReduce(events, (acc, _, event) => {
      const handler = () => { setContentVisibility((v) => !v) }
      trigger.addEventListener(event, handler)
      acc.push([event, handler])
      return acc
    }, [] as Array<[keyof HTMLElementEventMap, EmptyFunction]>)
    return () => {
      handlers.forEach(([event, handler]) => {
        trigger.removeEventListener(event, handler)
      })
    }
    // NOTE: This doesn't play very nicely with elements that have exit animations, may be have a `TriggerAnimatedSpawn` that deliberately adds delay and useContext to signal unmounting?
  }, [events, trigger])
  return (!!trigger && shouldShowContent) && <>{children}</>
}

__setDisplayName(TriggerSpawn)
Trigger.Spawn = TriggerSpawn
