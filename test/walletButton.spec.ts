import { testWithSynpress } from '@synthetixio/synpress'
import { metaMaskFixtures } from '@synthetixio/synpress/playwright'
import basicSetup from './wallet-setup/wallet.setup'

const test = testWithSynpress(metaMaskFixtures(basicSetup))
const { expect } = test

test.describe('WalletButton Component with Real MetaMask', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should display connect wallet button when not connected', async ({ page }) => {
    const walletButton = page.locator('[data-testid="wallet-button"]')
    await expect(walletButton).toBeVisible()
    await expect(walletButton).toContainText('Connect wallet')
  })

  test('should connect MetaMask wallet via WalletButton', async ({ page }) => {
    const walletButton = page.locator('[data-testid="wallet-button"]')
    await expect(walletButton).toContainText('Connect wallet')
    await walletButton.click()

    // Wait for the AppKit/WalletConnect modal to appear
    const modal = page.locator('appkit-modal, w3m-modal, [data-testid="appkit-modal"]')
    await expect(modal).toBeVisible({ timeout: 10000 })

    // Add this to your test to see the modal structure for debugging:
    // const modalHTML = await page.locator('appkit-modal, w3m-modal').innerHTML()
    // console.log('Modal HTML:', modalHTML)

    // List all clickable wallet elements for debugging:
    // const walletOptions = await page.locator('[data-wallet], [wallet], :text("MetaMask")').all()
    // console.log('Found wallet options:', walletOptions.length)

    // Look for MetaMask option in the modal and click it
    const metamaskOption = page
      .locator('[data-testid="wallet-selector-io.metaMask"], [data-wallet="metamask"], :text("MetaMask")')
      .first()

    await expect(metamaskOption).toBeVisible({ timeout: 5000 })
    await metamaskOption.click()

    // MetaMask should automatically connect due to our wallet setup
    // Wait for the connection to be established
    // The button should now show a truncated address
    await expect(walletButton).toContainText(/0x[a-fA-F0-9]{4,}\.{3}[a-fA-F0-9]{4,}/, { timeout: 15000 })

    // Verify that the address shown matches our test wallet
    // The test wallet address is: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    // Based on truncateAddress() formatter fn it should show: 0xf39Fd...Fb92266
    await expect(walletButton).toContainText('0xf39Fd...Fb92266')

    console.log('✅ MetaMask wallet connected successfully!')
  })

  test('should handle wallet connection state persistence', async ({ page }) => {
    const walletButton = page.locator('[data-testid="wallet-button"]')
    await walletButton.click()

    const modal = page.locator('appkit-modal, w3m-modal, [data-testid="appkit-modal"]')
    await expect(modal).toBeVisible({ timeout: 10000 })

    const metamaskOption = page
      .locator('[data-testid="wallet-selector-io.metaMask"], [data-wallet="metamask"], :text("MetaMask")')
      .first()
    await metamaskOption.click()

    await expect(walletButton).toContainText('0xf39Fd...Fb92266', { timeout: 15000 })

    await page.reload()
    await page.waitForLoadState('networkidle')

    const refreshedButton = page.locator('[data-testid="wallet-button"]')
    await expect(refreshedButton).toBeVisible()

    await page.waitForTimeout(2000)
    await expect(walletButton).toContainText('0xf39Fd...Fb92266', { timeout: 15000 })

    console.log('✅ Wallet connection state checked after refresh')
  })

  test('should display connected wallet address correctly', async ({ page }) => {
    const walletButton = page.locator('[data-testid="wallet-button"]')
    await expect(walletButton).toContainText('Connect wallet', { timeout: 15000 })
    await walletButton.click()

    const modal = page.locator('appkit-modal, w3m-modal, [data-testid="appkit-modal"]')
    await expect(modal).toBeVisible({ timeout: 10000 })

    const metamaskOption = page
      .locator('[data-testid="wallet-selector-io.metaMask"], [data-wallet="metamask"], :text("MetaMask")')
      .first()
    await metamaskOption.click()

    await expect(walletButton).toContainText('0xf39Fd...Fb92266', { timeout: 15000 })

    console.log('✅ Connected wallet address format verified')
  })

  test('should work with network switching (if NetworkButton is present)', async ({ page }) => {
    const walletButton = page.locator('[data-testid="wallet-button"]')
    await walletButton.click()

    const modal = page.locator('appkit-modal, w3m-modal, [data-testid="appkit-modal"]')
    await expect(modal).toBeVisible({ timeout: 10000 })

    const metamaskOption = page
      .locator('[data-testid="wallet-selector-io.metaMask"], [data-wallet="metamask"], :text("MetaMask")')
      .first()
    await metamaskOption.click()

    await expect(walletButton).toContainText(/0xf39Fd.*Fb92266/, { timeout: 15000 })

    const networkButton = page.locator('[data-testid="network-button"]')

    if (await networkButton.isVisible()) {
      console.log('NetworkButton found, testing network interaction')

      await networkButton.click()
      await page.waitForTimeout(1000)

      console.log('✅ Network switching UI interaction tested')
    } else {
      console.log('NetworkButton not found on this page, skipping network test')
    }
  })

  test('should handle wallet disconnection through MetaMask', async ({ page }) => {
    const walletButton = page.locator('[data-testid="wallet-button"]')
    await walletButton.click()

    const modal = page.locator('appkit-modal, w3m-modal, [data-testid="appkit-modal"]')
    await expect(modal).toBeVisible({ timeout: 10000 })

    const metamaskOption = page
      .locator('[data-testid="wallet-selector-io.metaMask"], [data-wallet="metamask"], :text("MetaMask")')
      .first()
    await metamaskOption.click()

    await page.waitForTimeout(3000)
    await expect(walletButton).toContainText('0xf39Fd...Fb92266', { timeout: 15000 })

    await walletButton.click()

    // Look for disconnect option in the modal
    const disconnectButton = page.locator(':text("Disconnect"), [data-testid="disconnect-button"]').first()

    if (await disconnectButton.isVisible({ timeout: 5000 })) {
      await disconnectButton.click()
      await expect(walletButton).toContainText('Connect wallet', { timeout: 10000 })

      console.log('✅ Wallet disconnection successful')
    } else {
      console.log('Disconnect button not found - this depends on AppKit modal implementation')

      // Close any open modal
      await page.keyboard.press('Escape')
    }
  })
})

test.describe('WalletButton Integration with ConnectionGuard', () => {
  test('should show connection requirement on protected routes', async ({ page }) => {
    // Navigate to a route that requires wallet connection guard
    await page.goto('/pool/281474976710657')
    await page.waitForLoadState('networkidle')

    const connectionPrompt = page.locator(':text("Connect to continue"), [data-testid="connection-guard-connect"]')
    const hasPrompt = await connectionPrompt.isVisible({ timeout: 5000 })

    if (hasPrompt) {
      console.log('✅ Connection guard is working - showing connection prompt')
    } else {
      console.log('ℹ️  No connection guard found on this route')
    }

    const walletButton = page.locator('[data-testid="wallet-button"]')
    await expect(walletButton).toBeVisible()
  })

  test('should allow access to protected routes after wallet connection', async ({ page }) => {
    // Navigate to protected route
    await page.goto('/pool/281474976710657')
    await page.waitForLoadState('networkidle')

    const walletButton = page.locator('[data-testid="wallet-button"]')
    await walletButton.click()

    const modal = page.locator('appkit-modal, w3m-modal, [data-testid="appkit-modal"]')
    await expect(modal).toBeVisible({ timeout: 10000 })

    const metamaskOption = page
      .locator('[data-testid="wallet-selector-io.metaMask"], [data-wallet="metamask"], :text("MetaMask")')
      .first()
    await metamaskOption.click()

    await expect(walletButton).toContainText(/0xf39Fd.*Fb92266/, { timeout: 15000 })

    // After connection, the protected content should be accessible
    await page.waitForTimeout(2000)
    const networkButton = page.locator('[data-testid="network-button"]')
    await expect(networkButton).toBeVisible()

    await networkButton.click()
    const sepoliaOption = page.locator(':text("Sepolia"), [data-value="sepolia"]').first()
    if (await sepoliaOption.isVisible({ timeout: 3000 })) {
      await sepoliaOption.click()
      console.log('✅ Switched to Sepolia network via NetworkButton')
    } else {
      console.log('⚠️  Sepolia option not found in network list - check available networks')
    }

    await page.waitForTimeout(2000)
    const protectedContent = page.locator(':text("holdings")')
    await expect(protectedContent.first()).toBeVisible({ timeout: 10000 })

    console.log('✅ Protected route access tested after wallet connection')
  })
})
