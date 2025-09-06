import { defineWalletSetup } from '@synthetixio/synpress'
import { MetaMask } from '@synthetixio/synpress/playwright'

const TEST_SEED_PHRASE = 'test test test test test test test test test test test junk'
const PASSWORD = 'SynpressTest123!'

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD)
  await metamask.importWallet(TEST_SEED_PHRASE)

  // The test wallet address for the above seed phrase should be:
  // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  console.log('✅ MetaMask wallet setup completed')
})
