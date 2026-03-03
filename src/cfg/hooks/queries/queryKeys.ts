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

  // Investor keys
  investor: (address: string) => ['investor', address] as const,
  portfolio: (address: string) => ['portfolio', address] as const,
  isMember: (address: string, scId: string, centrifugeId: number) => ['isMember', address, scId, centrifugeId] as const,

  // Batch query keys
  allPoolsVaults: (poolIdsKey: string) => ['allPoolsVaults', poolIdsKey] as const,
  investmentsPerVaults: (vaultAddressesKey: string) => ['investmentsPerVaults', vaultAddressesKey] as const,
  poolsAccessStatus: (poolIdsKey: string) => ['poolsAccessStatus', poolIdsKey] as const,
} as const
