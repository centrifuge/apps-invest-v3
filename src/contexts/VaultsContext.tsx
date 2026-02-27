import { Vault } from '@centrifuge/sdk'
import {
  Investment,
  useInvestment,
  useInvestmentsPerVaults,
  useVaultDetails,
  useVaults,
  useVaultsDetails,
  VaultDetails,
} from '@cfg'
import { usePoolContext } from '@contexts/PoolContext'
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useRef, useState } from 'react'

export interface VaultsContextValues {
  investment?: Investment
  investmentsPerVaults?: Investment[]
  isInvestmentLoading: boolean
  isLoading: boolean
  isVaultDetailsLoading: boolean
  vault?: Vault
  vaults?: Vault[]
  vaultDetails?: VaultDetails
  vaultsDetails?: VaultDetails[]
  setVault: Dispatch<SetStateAction<Vault | undefined>>
  setVaults: Dispatch<SetStateAction<Vault[] | undefined>>
}

const defaultVaultsContextValues: VaultsContextValues = {
  investment: undefined,
  investmentsPerVaults: [],
  isInvestmentLoading: false,
  isLoading: false,
  isVaultDetailsLoading: false,
  vault: undefined,
  vaults: [],
  vaultDetails: undefined,
  vaultsDetails: undefined,
  setVault: () => {},
  setVaults: () => {},
}

const VaultsContext = createContext<VaultsContextValues>(defaultVaultsContextValues)

export const VaultsProvider = ({ children }: { children: ReactNode }) => {
  const { assetFromUrl, isPoolDataReady, network, shareClassId } = usePoolContext()
  const [vault, setVault] = useState<Vault | undefined>(undefined)
  const [vaults, setVaults] = useState<Vault[] | undefined>(undefined)

  const { data: poolNetworkVaults, isLoading: isPoolVaultsLoading } = useVaults(network, shareClassId, {
    enabled: isPoolDataReady,
  })
  const { data: vaultsDetails, isLoading: isVaultsDetailsLoading } = useVaultsDetails(vaults, {
    enabled: isPoolDataReady,
  })
  const { data: vaultDetails, isLoading: isVaultDetailsLoading } = useVaultDetails(vault, {
    enabled: isPoolDataReady,
  })
  const { data: investment, isLoading: isInvestmentLoading } = useInvestment(vault, {
    enabled: isPoolDataReady,
  })
  const { data: investmentsPerVaults, isLoading: isInvestmentsPerVaultsLoading } = useInvestmentsPerVaults(vaults, {
    enabled: isPoolDataReady,
  })

  const lastNetworkCentrifugeIdRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    // Reset vaults when network changes
    if (network?.centrifugeId !== lastNetworkCentrifugeIdRef.current) {
      setVault(undefined)
      setVaults(undefined)
      lastNetworkCentrifugeIdRef.current = network?.centrifugeId
    }
  }, [network?.centrifugeId])

  useEffect(() => {
    if (!poolNetworkVaults) return
    setVaults(poolNetworkVaults)
  }, [poolNetworkVaults])

  const currentVaultAssetAddress = vaultDetails?.asset.address

  useEffect(() => {
    if (!poolNetworkVaults?.length || !vaultsDetails?.length) return

    if (assetFromUrl) {
      const matchingVaultIndex = vaultsDetails.findIndex(
        (vd) => vd.asset.symbol.toLowerCase() === assetFromUrl.toLowerCase()
      )
      if (matchingVaultIndex !== -1) {
        const matchingVault = poolNetworkVaults[matchingVaultIndex]
        const matchingVaultDetails = vaultsDetails[matchingVaultIndex]
        // Only update if different vault (compare by asset address for stability)
        if (matchingVault && matchingVaultDetails?.asset.address !== currentVaultAssetAddress) {
          setVault(matchingVault)
        }
        return
      }
    }

    if (!vault && poolNetworkVaults[0]) {
      setVault(poolNetworkVaults[0])
    }
  }, [poolNetworkVaults, vaultsDetails, assetFromUrl, currentVaultAssetAddress, vault])

  const isLoading =
    isPoolVaultsLoading ||
    isVaultDetailsLoading ||
    isVaultsDetailsLoading ||
    isInvestmentLoading ||
    isInvestmentsPerVaultsLoading

  return (
    <VaultsContext.Provider
      value={{
        investment,
        investmentsPerVaults,
        isInvestmentLoading,
        isLoading,
        isVaultDetailsLoading,
        vault,
        vaults,
        vaultDetails,
        vaultsDetails,
        setVault,
        setVaults,
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
