interface EthereumProvider {
  isMetaMask?: boolean
  [key: string]: any
}

interface Window {
  ethereum?: EthereumProvider
}
