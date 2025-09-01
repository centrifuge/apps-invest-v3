import { useEffect } from 'react'

// Handles legacy hash URLs and redirects appropriately
export default function HashUrlHandler() {
  useEffect(() => {
    const hash = window.location.hash

    if (hash && hash.startsWith('#/')) {
      const hashPath = hash.substring(1)
      const segments = hashPath.toLowerCase().split('/').filter(Boolean)

      if (segments.includes('migrate')) {
        window.location.replace(`https://migrate.centrifuge.io`)
        return
      }

      const newUrl = `${window.location.origin}${hashPath}${window.location.search}`
      window.location.replace(newUrl)
    }
  }, [])

  return null
}
