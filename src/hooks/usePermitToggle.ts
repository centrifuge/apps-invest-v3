import { useCallback, useSyncExternalStore } from 'react'
import { useCentrifuge } from '@cfg'

const STORAGE_KEY = 'centrifuge:permitDisabled'

function getSnapshot(): boolean {
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

function getServerSnapshot(): boolean {
  return false
}

const listeners = new Set<() => void>()

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

export function usePermitToggle() {
  const centrifuge = useCentrifuge()
  const permitDisabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  centrifuge.setPermitDisabled(permitDisabled)

  const setPermitDisabled = useCallback(
    (value: boolean) => {
      if (value) {
        localStorage.setItem(STORAGE_KEY, 'true')
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
      centrifuge.setPermitDisabled(value)
      listeners.forEach((listener) => listener())
    },
    [centrifuge]
  )

  return { permitDisabled, setPermitDisabled }
}
