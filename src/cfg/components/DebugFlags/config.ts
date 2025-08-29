import React from 'react'

const url = typeof window !== 'undefined' && window.location.href ? new URL(window.location.href) : null
const params = new URLSearchParams(url?.search || {})

const localStorage = typeof window !== 'undefined' ? window.localStorage : null

export const debug =
  url?.host.includes('localhost') || params.get('debug') != null || !!localStorage?.getItem('debugFlags')

export type DebugFlagConfig =
  | {
      type: 'text'
      default: string
      alwaysShow?: boolean
    }
  | {
      type: 'component'
      Component: React.FC<{ value: unknown; onChange: (v: unknown) => void }>
      default: string
      alwaysShow?: boolean
    }
  | {
      type: 'checkbox'
      default: boolean
      alwaysShow?: boolean
    }
  | {
      type: 'select'
      default: string
      options: Record<string, string>
      alwaysShow?: boolean
    }

export type Key = 'address' | 'persistDebugFlags'

export const flagsConfig = {
  address: {
    default: '',
    type: 'text',
  },
  persistDebugFlags: {
    alwaysShow: true,
    default: !!localStorage?.getItem('debugFlags'),
    type: 'checkbox',
  },
} satisfies Record<Key, DebugFlagConfig>

export const genericFlagsConfig: Record<string, DebugFlagConfig> = flagsConfig
