export function useGetPoolRestrictedCountries(poolId: string | undefined, isDerwaPool: boolean) {
  const restrictedPoolIds = ['281474976710662', '281474976710663']
  const restrictedCountries = restrictedPoolIds.includes(poolId ?? '') || isDerwaPool ? ['US'] : []
  return restrictedCountries
}
