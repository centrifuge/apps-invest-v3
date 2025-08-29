export const mockMetadata = {
  pool: {
    name: 'Tokenized AAA CLO',
    poolStatus: 'Active',
    asset: { class: 'Public credit', subClass: 'US Treasuries' },
    expenseRatio: '0.25',
    listed: true,
    poolStructure: 'Revolving',
    issuer: {
      description:
        '"Janus Henderson Anemoy Treasury Fund (the Fund) is a tokenized British Virgin Islands (BVI) professional fund, licensed by the British Virgin Islands Financial Services Commission (FSC), and open to non-US Professional Investors. It solely invests in and holds short-term U.S. Treasury Bills (T-bills) with a remaining maturity of 0 to 3 months to offer minimized price and duration risks in combination with daily liquidity and money market returns. T-bills are held directly by the Fund and Asset Under Management (AUM) can be checked onchain. The fund issues its shares as the JTRSY token to investors. Investments and redemptions are processed in USDC stablecoins. Janus Henderson Investors agreed to sub-advise Anemoy and act as the sub-Investment Manager of the Fund.\n"',
      email: 'support@anemoy.io',
      logo: {
        uri: 'ipfs://QmaJVD2b53xYFSRDBxg6X8977fwvyzoDuCxvambe4QvrqT',
        mime: 'image/png',
      },
      repName: 'Martin Quensel',
      name: 'Anemoy Capital SPC Limited',
      shortDescription:
        'Janus Henderson Anemoy Treasury Fund is a BVI-licensed fund investing in short-term U.S. T-bills.',
    },
    icon: {
      uri: 'ipfs://QmTQwFU4zWuwhm3ft77G7wcP6LYBo6nfhy7aJ4Hd9j6ryG',
      mime: 'image/png',
    },
    investorType: 'Non-US Professional Investors',
    poolRatings: [
      {
        agency: "Moody's",
        value: 'Aa-bf',
        reportUrl:
          'https://www.moodys.com/research/Moodys-Ratings-assigns-a-Aa-bf-Bond-Fund-rating-to-Anemoy-Assessment-Announcement--PR_495362',
        reportFile: {
          uri: 'ipfs://QmTXxiVMuBmYQtWQyJmj74m6XDzUsRNRhnMGo4HZMVyJUF',
          mime: 'application/pdf',
        },
      },
      {
        agency: 'Particula',
        value: 'AA+',
        reportUrl: 'https://particula.io/particula-rating-report-anemoy-ltf-september-2024/',
        reportFile: {
          uri: 'ipfs://QmeGLnWidpuyEJupqHPJdrAciEhrRCaafvXteHtMREidN4',
          mime: 'application/pdf',
        },
      },
      {
        agency: 'S&P Global',
        value: 'AA+f/S1+',
        reportUrl: 'https://www.capitaliq.spglobal.com/web/client#ratingsdirect/creditResearch?rid=3335911',
        reportFile: {
          uri: 'ipfs://QmQ9P1BuH6mBkN9Gs1aBZo34zX6NYigRZ84nu13Wi52CKC',
          mime: 'application/pdf',
        },
      },
    ],
  },
  shareClasses: {
    '0x00010000000000060000000000000001': {
      minInitialInvestment: '1000',
      apy: 'Target',
      apyPercentage: 5.983,
      weightedAverageMaturity: 49.42,
      defaultAccounts: { equity: 123, gain: 123, loss: 123 },
    },
  },
}
