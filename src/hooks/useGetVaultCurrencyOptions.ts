import { useMemo } from 'react'
import { useVaultsContext } from '@contexts/VaultsContext'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'

// isRedeem: true for redeem currency options, false for invest currency options
export function useGetVaultCurrencyOptions({ isRedeem }: { isRedeem: boolean }) {
  const { vaultsDetails } = useVaultsContext()
  const { getIsRwaPool, getIsDeRwaPool } = useGetPoolsByIds()

  const currencyOptions = useMemo(() => {
    if (!vaultsDetails) {
      return []
    }

    return vaultsDetails
      .filter((vault) => {
        const isRwaPool = getIsRwaPool(vault.pool.id.toString())
        const isDeRwaPool = getIsDeRwaPool(vault.pool.id.toString())
        /*
         * For RWA pools, any invest or redeem tx must be async, so we filter out sync vaults
         * For deRWA pools, invest or redeem tx must be sync, so we filter for sync only vaults
         */
        if (isRwaPool) {
          return isRedeem ? !vault.isSyncRedeem : !vault.isSyncDeposit
        }
        if (isDeRwaPool) {
          return isRedeem ? vault.isSyncRedeem : vault.isSyncDeposit
        }
        return false
      })
      .map((vault) => ({
        label: vault.asset.symbol,
        value: vault.address,
      }))
  }, [vaultsDetails, isRedeem, getIsRwaPool, getIsDeRwaPool])

  return currencyOptions
}
