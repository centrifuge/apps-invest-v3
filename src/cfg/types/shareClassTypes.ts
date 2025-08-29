import { AssetId, Balance, HexString, ShareClass } from '@centrifuge/sdk'

export type ShareClassWithDetails = {
  shareClass: ShareClass
  details: Awaited<ReturnType<typeof ShareClass.prototype.details>>
}

export type ShareClassDetails = Awaited<ReturnType<typeof ShareClass.prototype.details>>

export type PendingAmount = Awaited<ReturnType<typeof ShareClass.prototype.pendingAmounts>>

export type Holdings = Awaited<ReturnType<typeof ShareClass.prototype.balances>>

export type PendingIssuance = PendingAmount[number]['pendingIssuances'][number]

export type Asset = { decimals: number; address: HexString; name: string; symbol: string; chainId: number }
