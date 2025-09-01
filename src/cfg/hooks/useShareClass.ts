import { ShareClass } from '@centrifuge/sdk'
import { useObservable } from './useObservable'
import { useMemo } from 'react'
import { PendingAmount } from '../types'
import { map, of } from 'rxjs'

export function useNavPerNetwork(shareClass?: ShareClass, options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true
  const navPerNetwork$ = useMemo(
    () => (enabled && shareClass ? shareClass.navPerNetwork() : undefined),
    [shareClass, enabled]
  )
  return useObservable(navPerNetwork$)
}

export function useHoldings(shareClass?: ShareClass, options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true
  const holdings$ = useMemo(() => (enabled && shareClass ? shareClass.balances() : undefined), [shareClass, enabled])
  return useObservable(holdings$)
}

export function useHolding(shareClass: ShareClass, holdingId?: string) {
  const holdings$ = useMemo(() => shareClass.balances(), [shareClass])
  const holding$ = useMemo(() => {
    if (!holdingId || !holdings$) return of(undefined)
    return holdings$.pipe(map((h) => h.find((h) => h.assetId.raw.toString() === holdingId)))
  }, [holdings$, holdingId])
  return useObservable(holding$)
}

export const usePendingAmounts = (shareClass?: ShareClass, options?: { enabled?: boolean }) => {
  const enabled = options?.enabled ?? true
  const pendingAmounts$ = useMemo(
    () => (enabled && shareClass ? shareClass.pendingAmounts() : undefined),
    [shareClass, enabled]
  )
  return useObservable(pendingAmounts$)
}

export const useGroupPendingAmountsByChain = (pendingAmounts: PendingAmount) => {
  return useMemo(() => {
    return pendingAmounts?.reduce<Record<number, PendingAmount[number][]>>((acc, curr) => {
      acc[curr.chainId] = [...(acc[curr.chainId] || []), curr]
      return acc
    }, {})
  }, [pendingAmounts])
}

export const useBalanceSheet = (shareClass?: ShareClass, chainId?: number, options?: { enabled?: boolean }) => {
  const enabled = options?.enabled ?? true
  const balanceSheet$ = useMemo(
    () => (enabled && shareClass && chainId ? shareClass.balanceSheet(chainId) : undefined),
    [shareClass, chainId, enabled]
  )
  return useObservable(balanceSheet$)
}

export const useVaultsPerShareClass = (shareClass?: ShareClass, options?: { enabled?: boolean }) => {
  const enabled = options?.enabled ?? true
  const vaults$ = useMemo(() => (enabled && shareClass ? shareClass.vaults() : undefined), [shareClass, enabled])
  return useObservable(vaults$)
}

export const useBalances = (shareClass?: ShareClass, chainId?: number, options?: { enabled?: boolean }) => {
  const enabled = options?.enabled ?? true
  const balances$ = useMemo(
    () => (enabled && shareClass && chainId ? shareClass.balances(chainId) : undefined),
    [shareClass, chainId, enabled]
  )
  return useObservable(balances$)
}

export function useDeploymentPerPoolNetwork(shareClass?: ShareClass) {
  const deploymentPerNetwork$ = useMemo(() => {
    if (!shareClass) return undefined
    return shareClass.deploymentPerNetwork()
  }, [shareClass])

  return useObservable(deploymentPerNetwork$)
}
