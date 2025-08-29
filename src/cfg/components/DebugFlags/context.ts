import * as React from 'react'
import { debug, flagsConfig, genericFlagsConfig, Key } from './config'

const localStorage = typeof window !== 'undefined' ? window.localStorage : null

export type Flags = {
  [T in Key]: (typeof flagsConfig)[T] extends { options: { [key: string]: string } }
    ? string
    : (typeof flagsConfig)[T]['default'] extends boolean
      ? boolean
      : (typeof flagsConfig)[T]['default']
}

interface Context {
  flags: Flags
  register: (id: number, keys: string[]) => void
  unregister: (id: number) => void
}

export const defaultFlags: Flags = Object.entries(genericFlagsConfig).reduce((obj, [k, v]) => {
  Reflect.set(obj, k, 'options' in v ? v.options[v.default] : v.default)
  return obj
}, {} as Flags)

let persistedState: Flags | null = null
try {
  const stored = localStorage?.getItem('debugFlags') ?? ''
  if (stored !== '') {
    persistedState = JSON.parse(stored) as Flags
  }
} catch (e) {
  console.error(e)
}
const flagKeys = Object.keys(flagsConfig)
export const initialFlagsState: Flags = persistedState
  ? Object.entries(persistedState)
      .filter(([k]) => flagKeys.includes(k))
      .reduce((obj, [k, v]) => {
        Reflect.set(obj, k, v)
        return obj
      }, {} as Flags)
  : Object.entries(flagsConfig).reduce((obj, [k, v]) => {
      Reflect.set(obj, k, v.default)
      return obj
    }, {} as Flags)

export const DebugFlagsContext = React.createContext<Context>({ flags: defaultFlags, register() {}, unregister() {} })

let i = 0

/**
 * On render the Proxy in this hook tracks which properties are being accessed.
 * After mounting, it registers these properties with the DebugFlags provider,
 * so the provider knows which flags are being used on the page and can enable those in the debug panel
 */
export function useDebugFlags(): Flags {
  const [id] = React.useState(() => (i += 1))
  const ctx = React.useContext(DebugFlagsContext)
  const tracked = React.useRef<Record<string, boolean>>({})
  const stateRef = React.useRef(ctx.flags)
  stateRef.current = ctx.flags

  const proxiedFlags = React.useMemo(
    () =>
      new Proxy(ctx.flags, {
        get(_, prop: Key) {
          tracked.current[prop] = true
          return stateRef.current[prop]
        },
      }),
    []
  )

  React.useEffect(() => {
    ctx.register(id, Object.keys(tracked.current))

    return () => ctx.unregister(id)
  }, [])

  return debug ? proxiedFlags : ctx.flags
}
