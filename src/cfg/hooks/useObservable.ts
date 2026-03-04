import { useMemo, useReducer, useRef, useState, useSyncExternalStore } from 'react'
import { catchError, of, share, timer, type Observable, type ObservedValueOf } from 'rxjs'
import { map, tap } from 'rxjs/operators'

export type ObservableOptions = never

/**
 * Hook to use an observable in a React component.
 * @param observable The observable to subscribe to. Should be stable (e.g. memoized).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useObservable<T = void>(observable?: Observable<T>, _options?: ObservableOptions) {
  const { snapshot, retry } = useObservableInner(observable)

  return {
    data: snapshot.data,
    error: snapshot.error,
    status: snapshot.status,
    isIdle: snapshot.status === 'idle',
    isLoading: snapshot.status === 'loading',
    isSuccess: snapshot.status === 'success',
    isError: snapshot.status === 'error',
    retry,
  }
}

export function useObservableWithRefresh<T = void>(observable?: Observable<T>, _options?: ObservableOptions) {
  const query = useObservable(observable, _options)
  const [visibleData, setVisibleData] = useState(query.data)

  return {
    ...query,
    data: visibleData,
    hasFreshData: query.data !== visibleData,
    refresh: () => {
      setVisibleData(query.data)
    },
  }
}

type CacheRecord<T> = {
  observable: Observable<unknown>
  snapshot: {
    data?: T
    error?: unknown
    status: 'idle' | 'loading' | 'success' | 'error'
  }
  // Allows observables to emit `undefined` and still be successful
  didEmitData: boolean
}

const cache = new WeakMap<Observable<any>, CacheRecord<any>>()

function useObservableInner<ObservableType extends Observable<any>>(observable?: ObservableType) {
  useWarnIfNotStable(observable, "useObservable: observable is not stable. Don't forget to memoize it!")

  const [updateCount, forceUpdate] = useReducer((s) => s + 1, 0)
  const store = useMemo(() => {
    if (!observable) return
    if (!cache.has(observable)) {
      const entry = {
        snapshot: {
          status: 'loading',
        },
        didEmitData: false,
      } as CacheRecord<ObservedValueOf<ObservableType>>
      entry.observable = observable.pipe(
        map((value) => ({ data: value, error: undefined, hasData: true })),
        catchError((error) => of({ data: entry.snapshot.data, error, hasData: entry.didEmitData })),
        tap((result) => {
          entry.didEmitData = result.hasData
          entry.snapshot = {
            ...result,
            status: entry.didEmitData ? 'success' : 'error',
          }
          if (result.error) {
            console.error(result.error)
          }
        }),
        // Share the observable to prevent unsubscribing and resubscribing between the immediate subscription and the useSyncExternalStore subscription.
        share({
          resetOnRefCountZero: () => timer(0),
        })
      )

      // Eagerly subscribe to sync set `entry.snapshot`.
      const subscription = entry.observable.subscribe()
      subscription.unsubscribe()

      cache.set(observable, entry)
    }
    const instance = cache.get(observable)!

    return {
      subscribe: (onStoreChange: () => void) => {
        const subscription = instance.observable.subscribe(() => onStoreChange())
        return () => {
          subscription.unsubscribe()
        }
      },
      getSnapshot: () => {
        return instance.snapshot
      },
    }
    // forceUpdate will cause the store to be recreated, and resubscribed to.
    // Which, in case of an error, will restart the observable.
  }, [observable, updateCount])

  const res = useSyncExternalStore(store?.subscribe || noopStore.subscribe, store?.getSnapshot || noopStore.getSnapshot)

  function resetError() {
    if (observable) {
      const entry = cache.get(observable)
      if (entry) {
        entry.snapshot = {
          ...entry.snapshot,
          error: undefined,
        }
      }
    }
  }

  return {
    snapshot: res as CacheRecord<ObservedValueOf<ObservableType>>['snapshot'],
    retry: () => {
      resetError()
      forceUpdate()
    },
  }
}

const noopSnapshot = {
  status: 'idle' as const,
}
const noopStore = {
  subscribe: () => () => {},
  getSnapshot: () => noopSnapshot,
}

function useWarnIfNotStable(object?: unknown, message = 'object is not stable') {
  const ref = useRef({ hasObjectCount: 0, stableObjectCount: 0, lastObject: object })
  if (object && ref.current.lastObject) {
    ref.current.hasObjectCount++
    if (ref.current.lastObject === object) {
      ref.current.stableObjectCount++
    }
    if (ref.current.hasObjectCount === 10 && ref.current.stableObjectCount <= 1) {
      console.warn(message, object)
    }
  }
  ref.current.lastObject = object
}
