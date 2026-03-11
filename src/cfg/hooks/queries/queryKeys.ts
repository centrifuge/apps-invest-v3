export const queryKeys = {
  // Pool keys
  pools: () => ['pools'] as const,
  pool: (poolId: string) => ['pool', poolId] as const,
  poolDetails: (poolId: string) => ['poolDetails', poolId] as const,
  allPoolDetails: (poolIdsKey: string) => ['allPoolDetails', poolIdsKey] as const,
  poolActiveNetworks: (poolId: string) => ['poolActiveNetworks', poolId] as const,
  poolNetworks: (poolId: string) => ['poolNetworks', poolId] as const,

  // Vault keys
  vaults: (centrifugeId: number, scId: string) => ['vaults', centrifugeId, scId] as const,
  vaultDetails: (vaultAddress: string) => ['vaultDetails', vaultAddress] as const,
  vaultsDetails: (vaultAddressesKey: string) => ['vaultsDetails', vaultAddressesKey] as const,

  // Blockchain keys
  blockchains: () => ['blockchains'] as const,

  // Share class keys
  shareClassDetails: (shareClassId: string) => ['shareClassDetails', shareClassId] as const,
  holdings: (shareClassId: string) => ['holdings', shareClassId] as const,

  // Investor keys
  investor: (address: string) => ['investor', address] as const,
  portfolio: (address: string) => ['portfolio', address] as const,
  isMember: (address: string, scId: string, centrifugeId: number) => ['isMember', address, scId, centrifugeId] as const,
  investment: (vaultAddress: string, walletAddress: string) => ['investment', vaultAddress, walletAddress] as const,

  // Holding escrow keys
  holdingEscrows: (tokenId: string) => ['holdingEscrows', tokenId] as const,

  // Token instance keys
  tokenInstances: (addresses: string[]) => ['tokenInstances', ...addresses] as const,
  // Bridge validation keys
  shareClassDeployments: (shareClassId: string) => ['shareClassDeployments', shareClassId] as const,
  bridgeTransferRestrictions: (fromCentrifugeId: number, receiverAddress: string, destinationIdsKey: string) =>
    ['bridgeTransferRestrictions', fromCentrifugeId, receiverAddress, destinationIdsKey] as const,

  // Batch query keys
  allPoolsVaults: (poolIdsKey: string) => ['allPoolsVaults', poolIdsKey] as const,
  investmentsPerVaults: (vaultAddressesKey: string) => ['investmentsPerVaults', vaultAddressesKey] as const,
  poolsAccessStatus: (poolIdsKey: string) => ['poolsAccessStatus', poolIdsKey] as const,
} as const
