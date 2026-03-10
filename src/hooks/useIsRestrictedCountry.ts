import { type PoolDetails } from '@cfg'
import { useGeolocation } from '@hooks/useGeolocation'
import { useGetPoolRestrictedCountries } from '@hooks/useGetPoolRestrictedCountries'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'

export function useIsRestrictedCountry(poolDetails: PoolDetails | undefined, enabled: boolean) {
  const { getIsDeRwaPool } = useGetPoolsByIds()
  const { data: location } = useGeolocation({ enabled })

  const poolRestrictedCountries = useGetPoolRestrictedCountries(
    poolDetails?.id.toString(),
    getIsDeRwaPool(poolDetails?.id.toString())
  )
  const kycCountries = poolDetails?.metadata?.onboarding?.kycRestrictedCountries ?? []
  const kybCountries = poolDetails?.metadata?.onboarding?.kybRestrictedCountries ?? []
  const restrictedCountries = [...kycCountries, ...kybCountries, ...poolRestrictedCountries]

  return restrictedCountries.includes(location?.country_code ?? '')
}
