import { c } from '@glyph-cat/swiss-army-knife'
import { View } from '@glyph-cat/swiss-army-knife-react'
import { __getTypeMarker, __setTypeMarker, TypeMarker } from 'packages/react/src/_internals'
import {
  Children,
  ForwardedRef,
  forwardRef,
  JSX,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
} from 'react'
import {
  Popover,
  PopoverContent,
  PopoverContentProps,
  PopoverTrigger,
} from '../popover'
import styles from './index.module.css'

export interface MenuProps {
  children: ReactNode
}

// TODO: type to jump to closest result
// TODO: disable user select when click and drag
// TODO: compact and non-compact
// TODO: leading and trailing icons
// TODO: scrolling when there are too many items
// TODO: Add focus tracking for menu with input focus to prevent keyboard shortcuts from interfering

export function Menu({ children }: MenuProps): JSX.Element {
  const [triggerElement] = Children.toArray(children) as Array<ReactElement>
  if (__getTypeMarker(triggerElement.type) !== TypeMarker.MenuTrigger) {
    throw new Error('The first children of <Menu> must be a <MenuTrigger>')
  }
  return <Popover>{children}</Popover>
}

export interface MenuTriggerProps {
  children: ReactNode
}

export function MenuTrigger({
  children,
}: MenuTriggerProps): JSX.Element {
  return <PopoverTrigger>{children}</PopoverTrigger>
}

__setTypeMarker(MenuTrigger, TypeMarker.MenuTrigger)

// #region MenuPopover

export interface MenuPopoverProps extends PopoverContentProps {
  children: ReactElement<MenuListProps, JSXElementConstructor<MenuListProps>>
}

export function MenuPopover({
  children,
  ...props
}: MenuPopoverProps): JSX.Element {
  return (
    <PopoverContent {...props}>
      {children}
    </PopoverContent>
  )
}

// #endregion MenuPopover

// #region MenuList

export type MenuListProps = JSX.IntrinsicElements['ul']

export const MenuList = forwardRef(({
  children,
  className,
  ...props
}: MenuListProps, ref: ForwardedRef<HTMLUListElement>): JSX.Element => {
  return (
    <ul
      className={c(styles.ul, className)}
      ref={ref}
      {...props}
    >
      {children}
    </ul>
  )
})

// #endregion MenuList

// #region MenuItem

export type MenuItemProps = JSX.IntrinsicElements['li'] & {
  disabled?: boolean
}

export function MenuItem({
  children,
  disabled,
  ...props
}: MenuItemProps): JSX.Element {
  return (
    <li
      data-type='item'
      data-enabled={!disabled}
      {...props}
    >
      <View>
        {/* KIV: render a view anyway, this will facilitate placement of icons etc */}
        {children}
      </View>
    </li>
  )
}

// #endregion MenuItem

export function MenuSeparator(): JSX.Element {
  return <li data-type='separator' />
}
