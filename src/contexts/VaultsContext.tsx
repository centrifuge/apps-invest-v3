import { Vault } from '@centrifuge/sdk'
import { Investment, useInvestment, useVaultDetails, useVaults, useVaultsDetails, VaultDetails } from '@cfg'
import { usePoolContext } from '@contexts/PoolContext'
import { createContext, ReactNode, useContext, useMemo } from 'react'

export interface VaultsContextValues {
  investment?: Investment
  isInvestmentLoading: boolean
  isLoading: boolean
  isVaultDetailsLoading: boolean
  vault?: Vault
  vaults?: Vault[]
  vaultDetails?: VaultDetails
  vaultsDetails?: VaultDetails[]
}

const defaultVaultsContextValues: VaultsContextValues = {
  investment: undefined,
  isInvestmentLoading: false,
  isLoading: false,
  isVaultDetailsLoading: false,
  vault: undefined,
  vaults: [],
  vaultDetails: undefined,
  vaultsDetails: undefined,
}

const VaultsContext = createContext<VaultsContextValues>(defaultVaultsContextValues)

export const VaultsProvider = ({ children }: { children: ReactNode }) => {
  const { assetFromUrl, isPoolDataReady, network, shareClassId } = usePoolContext()

  const { data: poolNetworkVaults, isLoading: isPoolVaultsLoading } = useVaults(network, shareClassId, {
    enabled: isPoolDataReady,
  })

  const vaults = poolNetworkVaults

  const { data: vaultsDetails, isLoading: isVaultsDetailsLoading } = useVaultsDetails(vaults, {
    enabled: isPoolDataReady,
  })

  // Derive selected vault synchronously from query data to avoid render-gap flashes.
  const vault = useMemo(() => {
    if (!poolNetworkVaults?.length || !vaultsDetails?.length) return undefined

    if (assetFromUrl) {
      // Match by vault contract address (primary) or asset symbol (legacy fallback)
      const isAddress = assetFromUrl.startsWith('0x')
      if (isAddress) {
        const matchingIndex = poolNetworkVaults.findIndex((v) => v.address.toLowerCase() === assetFromUrl.toLowerCase())
        if (matchingIndex !== -1) return poolNetworkVaults[matchingIndex]
      } else {
        const matchingIndex = vaultsDetails.findIndex(
          (vd) => vd.asset.symbol.toLowerCase() === assetFromUrl.toLowerCase()
        )
        if (matchingIndex !== -1) return poolNetworkVaults[matchingIndex]
      }
    }

    return poolNetworkVaults[0]
  }, [poolNetworkVaults, vaultsDetails, assetFromUrl])

  const { data: vaultDetails, isLoading: isVaultDetailsLoading } = useVaultDetails(vault, {
    enabled: isPoolDataReady,
  })
  const { data: investment, isLoading: isInvestmentLoading } = useInvestment(vault, {
    enabled: isPoolDataReady,
  })

  const isLoading = isPoolVaultsLoading || isVaultDetailsLoading || isVaultsDetailsLoading || isInvestmentLoading

  return (
    <VaultsContext.Provider
      value={{
        investment,
        isInvestmentLoading,
        isLoading,
        isVaultDetailsLoading,
        vault,
        vaults,
        vaultDetails,
        vaultsDetails,
      }}
    >
      {children}
    </VaultsContext.Provider>
  )
}

export const useVaultsContext = () => {
  const context = useContext(VaultsContext)
  if (!context) {
    throw new Error('useVaultsContext must be used within a VaultsProvider that is in a PoolsProvider')
  }
  return context
}
