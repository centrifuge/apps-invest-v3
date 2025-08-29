export default {
  async fetch(request, env) {
    // Cloudflare will handle SPA fallback based on `not_found_handling`
    return env.ASSETS.fetch(request)
  },
}
