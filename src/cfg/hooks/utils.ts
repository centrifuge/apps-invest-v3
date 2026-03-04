import { type Observable, firstValueFrom, timeout } from 'rxjs'

const SDK_QUERY_TIMEOUT = 30_000 // 30 seconds

/**
 * Converts an SDK observable to a promise with a 30-second timeout.
 * Errors propagate to React Query which handles retries (3 by default).
 */
export function firstValueWithTimeout<T>(observable: Observable<T>): Promise<T> {
  return firstValueFrom(observable.pipe(timeout(SDK_QUERY_TIMEOUT)))
}
