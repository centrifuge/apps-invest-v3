import { useQuery } from '@tanstack/react-query'
import type { HexString, ShareClass } from '@centrifuge/sdk'
import { queryKeys } from './queries/queryKeys'
import { firstValueWithTimeout } from './utils'

/**
 * Cross-chain share token transfer validation
 *
 * A wallet can only bridge share tokens between two chains if ALL of the following criteria are met:
 *
 * 1. The share token is deployed on the source chain
 * 2. The share token's hook (restriction manager) is deployed on the source chain
 * 3. On the source chain, `checkTransferRestriction(sender, address(uint160(destCentrifugeId)), 0)`
 *    returns true — i.e. the destination chain's representative address is an allowed receiver
 * 4. The share token's hook (restriction manager) is deployed on the destination chain
 * 5. On the destination chain, `checkTransferRestriction(address(uint160(sourceCentrifugeId)), receiver, 0)`
 *    returns true — i.e. the receiver wallet is allowed to receive tokens from the source chain
 *
 * `useShareClassDeployments` handles criteria 1, 2, and 4 by fetching all networks
 * where both the share token and its hook are deployed.
 *
 * `useAllowedBridgeDestinations` handles criteria 3 and 5 by calling
 * `checkTransferRestriction` on both the source and destination chains for each
 * potential destination.
 */

/**
 * Fetches all networks where a share class has both a deployed share token and hook (restriction manager).
 * Used to build the list of selectable chains in the bridge form (criteria 1, 2, 4).
 */
export function useShareClassDeployments(shareClass?: ShareClass, options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true
  return useQuery({
    queryKey: queryKeys.shareClassDeployments(shareClass?.id?.toString() ?? ''),
    queryFn: () => firstValueWithTimeout(shareClass!.deploymentPerNetwork()),
    enabled: !!shareClass && enabled,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Given a source chain, validates which destination chains the receiver can bridge to
 * by checking transfer restrictions on both sides (criteria 3 and 5).
 *
 * Returns a `Map<centrifugeId, boolean>` indicating whether each destination is allowed.
 *
 * Re-evaluated when the source chain or receiver address changes (e.g. when the user
 * toggles "send to different address" and enters a custom recipient).
 */
export function useAllowedBridgeDestinations(
  shareClass?: ShareClass,
  fromCentrifugeId?: number,
  receiverAddress?: HexString,
  options?: { enabled?: boolean }
) {
  const enabled = (options?.enabled ?? true) && !!shareClass && !!fromCentrifugeId && !!receiverAddress
  return useQuery({
    queryKey: queryKeys.bridgeTransferRestrictions(
      fromCentrifugeId ?? 0,
      receiverAddress ?? '',
      shareClass?.id?.toString() ?? ''
    ),
    queryFn: () =>
      firstValueWithTimeout(shareClass!.allowedCrosschainTransferDestinations(fromCentrifugeId!, receiverAddress!)),
    enabled,
    staleTime: 60 * 1000,
  })
}
