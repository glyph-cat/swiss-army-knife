import { ElementType, ReactNode } from 'react'

export enum PortalType {
  JSX = 1,
  PARAMS,
}

export interface PortalDataByJSX {
  type: PortalType.JSX
  children: ReactNode
}

export interface PortalDataByParameters {
  type: PortalType.PARAMS
  children: ReactNode
  element: ElementType
  props: Record<string, unknown>
}

export type IPortalFactoryState = Record<number, PortalDataByJSX | PortalDataByParameters>
