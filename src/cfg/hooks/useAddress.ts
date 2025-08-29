import { useAccount } from 'wagmi'
import { useDebugFlags } from '../components/DebugFlags'

const useAddress = () => {
  const { address: debugAddress } = useDebugFlags()
  const { address, isConnected, chainId } = useAccount()

  return {
    address: (debugAddress as `0x${string}`) || address,
    isConnected,
    chainId,
  }
}

export { useAddress }
