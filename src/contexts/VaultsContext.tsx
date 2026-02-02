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

  const hasAutoSelectedRef = useRef(false)
  const lastPoolIdRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (selectedPoolId !== lastPoolIdRef.current) {
      hasAutoSelectedRef.current = false
      lastPoolIdRef.current = selectedPoolId?.toString()
    }
  }, [selectedPoolId])

  useEffect(() => {
    if (!poolNetworkVaults) return

    setVaults(poolNetworkVaults)

    if (!poolNetworkVaults.length) {
      setVault(undefined)
      return
    }

    setVault((currentVault) => {
      if (currentVault && poolNetworkVaults.some((v) => v.address === currentVault.address)) {
        return currentVault
      }
      return poolNetworkVaults[0]
    })
  }, [poolNetworkVaults])

  // Auto select and set any vault with claimable assets
  useEffect(() => {
    if (
      hasAutoSelectedRef.current ||
      !poolNetworkVaults?.length ||
      !investmentsPerVaults?.length ||
      investmentsPerVaults.length !== poolNetworkVaults.length
    ) {
      return
    }

    const vaultIndex = investmentsPerVaults.findIndex(
      (inv) => inv && (!inv.claimableDepositShares.isZero() || !inv.pendingDepositAssets.isZero())
    )

    if (vaultIndex !== -1) {
      setVault(poolNetworkVaults[vaultIndex])
      hasAutoSelectedRef.current = true
    }
  }, [poolNetworkVaults, investmentsPerVaults])

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
