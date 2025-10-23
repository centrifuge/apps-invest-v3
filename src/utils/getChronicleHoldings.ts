export interface Positions {
  current_price: string
  description: string
  market_value: string
  maturity_date: string
  units: number
  yield_to_maturity: string
  isin?: number
}

export interface ChronicleIpfsData {
  version: string
  payload: {
    input: {
      content: { document: string }
      proofs: Array<{ payload: { signature: string }; type: string }>
    }
    output: {
      dashboard: {
        document_date: string
        net_asset_value: string
        outstanding_shares: string
        price_per_share: string
        portfolio: {
          positions: Array<Positions>
        }
      }
      oracle: string
    }
    timestamp: number
  }
}

export function getChronicleHoldings(data: ChronicleIpfsData) {
  const holdings = data?.payload?.output?.dashboard?.portfolio?.positions ?? []
  holdings.forEach((p: Positions) => delete p.isin)
  const headers = holdings.length ? Object.keys(holdings[0]) : []

  return { headers, holdings, hasChronicleHoldings: holdings.length > 0 }
}
