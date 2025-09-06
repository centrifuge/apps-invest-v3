# Synpress E2E Tests with Real MetaMask

This directory contains end-to-end tests using Synpress v4, which provides real MetaMask integration for testing wallet connections.

## Overview

Synpress allows you to test your dApp with a real MetaMask extension, providing more realistic testing scenarios compared to mocked wallet providers.

## Setup

The Synpress setup includes:

- **Configuration**: `synpress.config.ts` in the project root
- **Test Directory**: `test/`
- **Wallet Setup**: `test/wallet-setup/basic.setup.ts`
- **Real MetaMask**: Automatic MetaMask extension installation and setup

## Running Tests

```bash
# Run Synpress tests (headless mode)
pnpm test:synpress

# Run via playwrights UI setup
pnpm test:synpress:ui

# Run with visible browser (recommended for debugging)
pnpm test:synpress:headed

# Debug mode with DevTools
pnpm test:synpress:debug

# Show last Synpress test report
pnpm test:synpress:report
```

## Test Files

- **`example.spec.ts`**: Basic setup verification and simple wallet connection
- **`wallet-button.spec.ts`**: Comprehensive WalletButton component testing

## Key Features

### Real MetaMask Integration

- Automatically installs MetaMask extension
- Uses real MetaMask UI and flows
- Tests actual wallet connection behavior
- Supports network switching and transaction signing

### Wallet Setup

The `basic.setup.ts` file configures:

- **Test Seed Phrase**: `test test test test test test test test test test test junk`
- **Test Wallet Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` [Test account setup](https://docs.synpress.io/docs/setup-playwright#setup)
- **Password**: `SynpressTest123!`

⚠️ **NEVER use this seed phrase or Wallet Address in production or with real funds!**

## Test Scenarios

### WalletButton Component Tests

1. **Display Tests**: Verify "Connect wallet" button visibility
2. **Connection Flow**: Test complete MetaMask connection process
3. **Address Display**: Verify correct address truncation format
4. **State Persistence**: Test connection state across page refreshes
5. **Network Integration**: Test with NetworkButton (if available)
6. **Disconnection**: Test wallet disconnection flows

### Integration Tests

1. **ConnectionGuard**: Test protected route behavior
2. **Route Access**: Verify access after wallet connection
3. **Error Handling**: Test various error scenarios

## Configuration

### Synpress Config (`synpress.config.ts`)

- **Single Worker**: Prevents wallet conflicts
- **Extended Timeouts**: Accommodates wallet operations
- **Chromium Only**: MetaMask requires Chrome/Chromium
- **Headed Mode**: Shows browser for wallet interactions

### Wallet Setup (`wallet-setup/basic.setup.ts`)

- **MetaMask Import**: Automatically imports test wallet
- **Password Setup**: Configures MetaMask password
- **Ready State**: Wallet is ready for immediate use in tests

## Best Practices

### Test Development

1. **Use `data-testid`**: Reliable element selection
2. **Extended Timeouts**: Wallet operations can be slow
3. **Wait for States**: Always wait for connection states
4. **Error Handling**: Test both success and failure cases

### Debugging

1. **Use Headed Mode**: See what's happening in the browser
2. **Console Logs**: Tests include helpful logging
3. **Screenshots**: Automatic screenshots on failure
4. **DevTools**: Use debug mode for step-through debugging

### Limitations

1. **Single Worker**: Tests run sequentially to avoid wallet conflicts
2. **Chromium Only**: MetaMask extension requirement
3. **Network Dependent**: Requires stable internet for extension download
4. **Slower Execution**: Real browser operations take more time

## Environment Variables

No additional environment variables are required. Synpress handles MetaMask setup automatically.

## Troubleshooting

### Common Issues

1. **MetaMask Not Found**: Ensure Chromium is being used
2. **Connection Timeouts**: Increase timeout values in tests
3. **Modal Not Found**: Verify AppKit modal selectors
4. **Address Mismatch**: Check wallet setup and truncation logic

### Debug Steps

1. Run with `pnpm test:synpress:headed` to see browser
2. Check console logs for MetaMask errors
3. Verify the wallet address in MetaMask UI
4. Ensure dev server is running on port 3003

## Extending Tests

To add new tests:

1. Create `.spec.ts` files in `test/`
2. Import the test fixtures: `testWithSynpress(metaMaskFixtures(basicSetup))`
3. Use the `metamask` fixture for wallet operations
4. Follow existing patterns for wallet interactions

## Comparison with Mock Tests

| Feature     | Synpress (Real MetaMask) | Mock Tests              |
| ----------- | ------------------------ | ----------------------- |
| Realism     | ✅ Real wallet behavior  | ⚠️ Simulated behavior   |
| Speed       | ❌ Slower execution      | ✅ Fast execution       |
| Reliability | ✅ Catches real issues   | ⚠️ May miss edge cases  |
| CI/CD       | ⚠️ Requires more setup   | ✅ Easy CI integration  |
| Debugging   | ✅ Real UI debugging     | ❌ Mock-specific issues |

Both testing approaches are valuable and complement each other in a comprehensive testing strategy.
