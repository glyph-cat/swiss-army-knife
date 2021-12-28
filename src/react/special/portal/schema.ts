import { ElementType, ReactNode } from 'react'
import { RelinkSource } from 'react-relink'

export enum PORTAL_TYPE {
  jsx = 1,
  params,
}

export interface PortalDataByJSX {
  type: PORTAL_TYPE.jsx
  children: ReactNode
}

export interface PortalDataByParameters {
  type: PORTAL_TYPE.params
  children: ReactNode
  element: ElementType
  props: Record<string, unknown>
}

export type PortalStateData = Record<number, PortalDataByJSX | PortalDataByParameters>

export interface PortalSet {
  Source: RelinkSource<PortalStateData>,
  Canvas(): JSX.Element,
  Portal(props: { children: ReactNode }): JSX.Element,
  renderInPortal(
    element: ElementType,
    props: Record<string, unknown>,
    children?: ReactNode
  ): Promise<number>,
  removeFromPortal(portalId: number): Promise<void>
}
