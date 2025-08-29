## Workflows Overview

### 🚀 Deploy to Dev/Demo (`deploy-dev.yml`)
- **PRs**: Deploy to `dev` environment
- **Push to main**: Deploy to `demo` environment
- **Includes**: Lighthouse testing and PR comments

### 🚀 Deploy to Staging/Production (`deploy-prod.yml`)
- **Prerelease**: Deploy to `staging` environment
- **Release**: Deploy to `production` environment

### 🔄 Manual Rollback (`rollback.yml`)
- Manual workflow to rollback to any release tag

### Reusable Actions
- **build-app**: Builds and uploads artifacts (testnet → actions storage, mainnet → release)
- **deploy-app**: Downloads artifacts and deploys to Cloudflare
- **lighthouse-test**: Performance testing
- **upsert-preview-comment**: Updates PR with deployment URL and Lighthouse report

### Required Secrets

#### Repository Secrets (for dev/demo)
```bash
gh secret set CLOUDFLARE_API_TOKEN --body "your-api-token"
gh secret set CLOUDFLARE_ACCOUNT_ID --body "your-account-id"
```

#### Production Environment Secrets
```bash
# Create production environment
gh api repos/:owner/:repo/environments --method POST --field name=production

# Upload secrets to production environment
gh secret set CLOUDFLARE_API_TOKEN --env production --body "your-api-token"
gh secret set CLOUDFLARE_ACCOUNT_ID --env production --body "your-account-id"
```

