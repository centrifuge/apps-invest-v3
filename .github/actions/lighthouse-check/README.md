# Lighthouse Check Action

Custom GitHub Action that runs Lighthouse audits and posts beautiful PR comments with performance scores.

## Features

- 🎯 Runs Lighthouse CI on deployment URLs
- 📊 Extracts real scores from JSON files (not CLI parsing)
- 🏷️ Generates GitHub-style badges with color coding
- 💬 Posts professional PR comments automatically
- ⚡ Fast execution (skips installation if already installed)

## Development

### Building

This action uses `@vercel/ncc` to bundle dependencies into a single file:

```bash
npm install
npm run build
```

The bundled file is `build/index.js` which contains all dependencies.

### Testing

Use the test script to simulate GitHub Actions environment:

```bash
node test.js
```

## Usage

```yaml
- name: '📊 Performance Test with Lighthouse'
  uses: ./.github/actions/lighthouse-check
  with:
    url: ${{ steps.deploy.outputs.deployment-url }}
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Outputs

- `report-url`: URL to detailed Lighthouse report
- `performance`: Performance score (0-100)
- `accessibility`: Accessibility score (0-100)  
- `best-practices`: Best practices score (0-100)
- `seo`: SEO score (0-100)
