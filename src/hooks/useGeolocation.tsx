import { useQuery } from '@tanstack/react-query'

interface GeolocationData {
  country?: string
  country_code?: string
  region?: string
  city?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  source: 'browser' | 'ip'
}

const fetchGeolocation = async (): Promise<GeolocationData> => {
  // Fallback to IP-based geolocation
  try {
    const response = await fetch('https://ipapi.co/json/')
    if (!response.ok) {
      throw new Error('IP geolocation failed')
    }

    const data = await response.json()

    if (data.status === 'fail') {
      throw new Error('IP location lookup failed')
    }

    return {
      country: data.country,
      country_code: data.countryCode,
      region: data.regionName,
      city: data.city,
      source: 'ip',
    }
  } catch (error) {
    console.error(error)
    throw new Error('Unable to determine location')
  }
}

export const useGeolocation = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ['geolocation'],
    queryFn: fetchGeolocation,
    enabled,
    staleTime: 15 * 60 * 1000,
    retry: 1,
    retryDelay: 3000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}
