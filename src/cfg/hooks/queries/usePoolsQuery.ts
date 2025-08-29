import { useMemo, useRef, useEffect, useState } from 'react'
import { Pool } from '@centrifuge/sdk'
import { usePools } from '../usePools'

// This is needed to store and compare the RxJs return value of usePools.
// UseObservable has subscription cycles where it temporarily emits undefined.
export const usePoolsQuery = () => {
  const { data: observableData, isLoading: isObservableLoading, error } = usePools()
  const [pools, setPools] = useState<Pool[] | undefined>(undefined)
  const lastValidDataRef = useRef<Pool[] | undefined>(undefined)

  useEffect(() => {
    if (observableData && Array.isArray(observableData) && observableData.length > 0) {
      if (observableData !== lastValidDataRef.current) {
        setPools(observableData)
        lastValidDataRef.current = observableData
      }
    }
  }, [observableData])

  const isLoading = useMemo(() => {
    return isObservableLoading && !pools
  }, [isObservableLoading, pools])

  return {
    data: pools,
    isLoading,
    error,
  }
}
