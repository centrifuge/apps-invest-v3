import {
  createPublicClient,
  createWalletClient,
  http,
  rpcSchema,
  toHex,
  type Account,
  type Chain,
  type Hex,
  type LocalAccount,
  type PublicClient,
  type Transport,
  type WalletClient,
} from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

type TenderlyVirtualNetwork = {
  id: string
  slug: string
  display_name: string
  status: string
  fork_config: {
    network_id: number
    block_number: string
  }
  virtual_network_config: {
    chain_config: {
      chain_id: number
    }
    accounts: {
      address: string
    }[]
  }
  rpcs: {
    url: string
    name: string
  }[]
}

type TenderlyError = {
  error: {
    id: string
    slug: string
    message: string
  }
}

type TokenAddress = string
type ReceivingAddress = string
type Amount = `0x${string}`
type CustomRpcSchema = [
  {
    Method: 'tenderly_setErc20Balance'
    Parameters: [TokenAddress, ReceivingAddress, Amount]
    ReturnType: string
  },
  {
    Method: 'anvil_dealERC20'
    Parameters: [TokenAddress, ReceivingAddress, Amount]
    ReturnType: string
  },
  {
    Method: 'tenderly_setBalance'
    Parameters: [ReceivingAddress, Amount]
    ReturnType: string
  },
  {
    Method: 'anvil_setBalance'
    Parameters: [ReceivingAddress, Amount]
    ReturnType: string
  },
]

const tUSD = '0x8503b4452Bf6238cC76CdbEE223b46d7196b1c93' // Sepolia tUSD address

const TENDERLY_API_URL = 'https://api.tenderly.co/api/v1'
const TENDERLY_VNET_URL = 'https://virtual.sepolia.rpc.tenderly.co'

export interface TenderlyConfig {
  projectSlug: string
  accountSlug: string
  accessKey: string
  enableLocalFork?: boolean
}

export class TenderlyFork {
  chain: Chain
  vnetId?: string
  _rpcUrl?: string
  private config: TenderlyConfig
  
  /**
   * after impersonateAddress is set, centrifuge.setSigner() must be called again to update the signer
   */
  private _impersonateAddress?: `0x${string}`
  get impersonateAddress() {
    return this._impersonateAddress
  }
  set impersonateAddress(address: `0x${string}` | undefined) {
    this._impersonateAddress = address
    this.setSigner()
  }
  
  forkedNetwork?: TenderlyVirtualNetwork
  
  get rpcUrl(): string {
    if (!this._rpcUrl) {
      throw new Error('RPC URL is not initialized. Ensure forkNetwork() or TenderlyFork.create() has been called.')
    }
    return this._rpcUrl
  }
  
  private _publicClient?: PublicClient<Transport, Chain, Account, CustomRpcSchema>
  get publicClient(): PublicClient<Transport, Chain, Account, CustomRpcSchema> {
    return this._publicClient ?? this.setPublicClient()
  }
  
  private _signer?: WalletClient
  get signer(): WalletClient {
    return this._signer ?? this.setSigner()
  }
  
  /**
   * if no account is set, one will be created randomly
   * if an impersonated address is set, a custom account will be created with that address which will override the fromAddress parameter in calls
   */
  private _account?: LocalAccount
  get account(): LocalAccount {
    if (this.impersonateAddress) return this.createCustomAccount(this.impersonateAddress)
    if (this._account) return this._account
    return this.createAccount()
  }

  constructor(chain: Chain, config: TenderlyConfig, vnetId?: string, rpcUrl?: string) {
    this.chain = chain
    this.config = config
    this.vnetId = vnetId
    this._rpcUrl = rpcUrl
  }

  public static async create(chain: Chain, config: TenderlyConfig, vnetId?: string): Promise<TenderlyFork> {
    let rpcUrl: string
    if (vnetId) {
      rpcUrl = `${TENDERLY_VNET_URL}/${vnetId}`
      return new TenderlyFork(chain, config, vnetId, rpcUrl)
    }
    const instance = new TenderlyFork(chain, config)
    await instance.forkNetwork()
    return instance
  }

  private setPublicClient<T extends CustomRpcSchema>(): PublicClient<Transport, Chain, Account, CustomRpcSchema> {
    this._publicClient =
      this._publicClient ??
      createPublicClient({
        chain: this.chain,
        transport: http(this.rpcUrl),
        rpcSchema: rpcSchema<T>(),
      })
    return this._publicClient!
  }

  private setSigner(): WalletClient {
    const client = createWalletClient({
      account: this.account,
      transport: http(this.rpcUrl),
      chain: this.chain,
      rpcSchema: rpcSchema<CustomRpcSchema>(),
    })

    const signer: ReturnType<typeof createWalletClient> = {
      ...client,
      // Override the request method to use override from address with impersonated account
      request: async (args) => {
        switch (args.method) {
          case 'eth_accounts':
            return [this.account.address]
          case 'eth_sendTransaction':
            // @ts-expect-error
            const impersonatedParams = args.params.map((arg: any) => ({ ...arg, from: this.account.address }))
            return client.request({ method: args.method, params: impersonatedParams })
        }
        // @ts-expect-error
        return client.request(args)
      },
    } as WalletClient
    this._signer = signer
    return signer
  }

  createAccount(privateKey?: Hex): LocalAccount {
    const key = privateKey ?? generatePrivateKey()
    const walletAccount = privateKeyToAccount(key)
    this._account = walletAccount
    return walletAccount
  }

  createCustomAccount(address: `0x${string}`): LocalAccount {
    return {
      address,
      type: 'local',
      source: 'custom',
      signMessage: async () => '0x',
      signTransaction: async () => '0x',
      signTypedData: async () => '0x',
      publicKey: '0x',
    }
  }

  async forkNetwork() {
    if (this.config.enableLocalFork) {
      const url = 'http://localhost:8544'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`Failed to fork network: ${response.statusText}`)
      }
      const { rpcUrl } = await response.json()
      console.log('🍴 Forked network locally', rpcUrl)
      this._rpcUrl = rpcUrl
      return { url: rpcUrl }
    }
    
    const tenderlyApi = `${TENDERLY_API_URL}/account/${this.config.accountSlug}/project/${this.config.projectSlug}/vnets`
    const timestamp = Date.now()
    const response = await fetch(tenderlyApi, {
      method: 'POST',
      headers: {
        'X-Access-Key': this.config.accessKey,
      },
      body: JSON.stringify({
        slug: `centrifuge-dapp-fork-${timestamp}`,
        display_name: `Centrifuge dApp Fork ${timestamp}`,
        fork_config: {
          network_id: this.chain.id,
        },
        virtual_network_config: {
          chain_config: {
            chain_id: this.chain.id,
          },
        },
        sync_state_config: {
          enabled: false,
        },
        explorer_page_config: {
          enabled: false,
          verification_visibility: 'bytecode',
        },
      }),
    })

    const virtualNetwork: TenderlyVirtualNetwork | TenderlyError = await response.json()
    if ('error' in virtualNetwork) {
      throw new Error(`Tenderly API Error: ${JSON.stringify(virtualNetwork.error)}`)
    }
    const forkedRpc = virtualNetwork.rpcs.find((rpc) => rpc.name === 'Admin RPC')
    if (!forkedRpc?.url) {
      throw new Error('Failed to find forked RPC URL')
    }

    console.log('🌐 Created Tenderly Virtual Network:', virtualNetwork.id)
    console.log('🔗 RPC URL:', forkedRpc.url)
    this.forkedNetwork = virtualNetwork
    this.vnetId = virtualNetwork.id
    this._rpcUrl = forkedRpc.url
    return { url: forkedRpc.url, vnetId: virtualNetwork.id }
  }

  async deleteTenderlyRpcEndpoint() {
    try {
      let url = ''
      if (this.config.enableLocalFork) {
        url = 'http://localhost:8544'
      } else {
        url = `${TENDERLY_API_URL}/account/${this.config.accountSlug}/project/${this.config.projectSlug}/vnets/${this.vnetId}`
      }
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'X-Access-Key': this.config.accessKey,
        },
      })
      if (response.status !== 204) {
        console.error('Failed to delete Tenderly RPC endpoint', this.vnetId)
        throw new Error(JSON.stringify(await response.json()))
      }
      console.log('🗑️ Deleted Tenderly RPC endpoint', this.vnetId)
      return response.status === 204
    } catch (error) {
      console.error('Failed to delete Tenderly RPC endpoint', this.vnetId)
      throw error
    }
  }

  async fundAccountEth(address: string, amount: bigint) {
    console.log(`💰 Funding ${address} with ${amount} ETH`)
    await this.publicClient.request({
      jsonrpc: '2.0',
      method: this.config.enableLocalFork ? 'anvil_setBalance' : 'tenderly_setBalance',
      params: [address, toHex(amount)],
      id: '1234',
    })
  }

  async fundAccountERC20(address: string, amount: bigint, tokenAddress?: string) {
    const token = tokenAddress || tUSD
    console.log(`🪙 Funding ${address} with ${amount} tokens (${token})`)
    await this.publicClient.request({
      jsonrpc: '2.0',
      method: this.config.enableLocalFork ? 'anvil_dealERC20' : 'tenderly_setErc20Balance',
      params: [token, address, toHex(amount)],
      id: '1234',
    })
  }

  async cleanup() {
    if (this.vnetId) {
      await this.deleteTenderlyRpcEndpoint()
    }
  }
}