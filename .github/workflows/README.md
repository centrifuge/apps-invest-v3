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
gh variable set CLOUDFLARE_ACCOUNT_ID --body "your-account-id"
```

#### Production Environment Secrets
```bash
# As of now, GitHub CLI does not natively support creating environments via a simple command,
# and the REST API for environments is only available for GitHub Enterprise Server.
# For public GitHub.com repositories, you must create environments manually in the repository settings UI.
# See: https://github.com/orgs/community/discussions/25220

# 1. Go to your repository → Settings → Environments → New environment, and create "production" there.


# 2. Upload secrets to production environment
gh secret set CLOUDFLARE_API_TOKEN --env production --body "your-api-token"
gh variable set CLOUDFLARE_ACCOUNT_ID --env production --body "your-account-id"
```

