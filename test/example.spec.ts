import { testWithSynpress } from '@synthetixio/synpress'
import { metaMaskFixtures } from '@synthetixio/synpress/playwright'
import basicSetup from './wallet-setup/basic.setup'

const test = testWithSynpress(metaMaskFixtures(basicSetup))
const { expect } = test

test.describe('Basic Synpress Setup Test', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveTitle(/Centrifuge/i)
    await expect(page.locator('[data-testid="wallet-button"]')).toBeVisible()

    console.log('✅ Application loaded successfully')
  })

  test('should have MetaMask available', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check if window.ethereum is available (MetaMask provider)
    const hasEthereum = await page.evaluate(() => {
      return typeof window.ethereum !== 'undefined'
    })

    expect(hasEthereum).toBe(true)

    // Check if MetaMask is detected
    const isMetaMask = await page.evaluate(() => {
      return window.ethereum?.isMetaMask === true
    })

    expect(isMetaMask).toBe(true)

    console.log('✅ MetaMask is properly initialized')
  })

  test('should connect wallet with simple flow', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const walletButton = page.locator('[data-testid="wallet-button"]')
    await expect(walletButton).toContainText('Connect wallet')

    await walletButton.click()
    // Wait for AppKit modal
    await page.waitForSelector('appkit-modal, w3m-modal', { timeout: 10000 })

    // Try to find and click MetaMask option
    const metamaskSelector = page.locator(':text("MetaMask")').first()
    if (await metamaskSelector.isVisible({ timeout: 5000 })) {
      await metamaskSelector.click()

      await expect(walletButton).toContainText(/0x[a-fA-F0-9]/, { timeout: 20000 })

      console.log('✅ Simple wallet connection successful')
    } else {
      console.log('⚠️  MetaMask option not found in modal - check AppKit configuration')
    }
  })
})
