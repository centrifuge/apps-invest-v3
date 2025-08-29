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
import { usePoolContext } from '@contexts/usePoolContext'
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'

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
  const { isPoolDataReady, network, selectedPoolId, shareClassId } = usePoolContext()
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

  useEffect(() => {
    if (poolNetworkVaults?.length && (!vault || !poolNetworkVaults.includes(vault))) {
      setVault(poolNetworkVaults[0])
    }

    if (vault && !poolNetworkVaults?.length) {
      setVault(undefined)
    }

    setVaults(poolNetworkVaults)
  }, [poolNetworkVaults, selectedPoolId, vault, setVault, setVaults])

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
