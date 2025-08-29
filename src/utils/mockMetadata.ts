export const mockMetadata = {
  pool: {
    name: 'Janus Henderson Anemoy Treasury Fund',
    asset: {
      class: 'Public credit',
      subClass: 'US Treasuries',
    },
    investorType: 'Non-US Professional Investors',
    icon: {
      uri: 'ipfs://QmTQwFU4zWuwhm3ft77G7wcP6LYBo6nfhy7aJ4Hd9j6ryG',
      mime: 'image/png',
    },
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
    '0x97aa65f23e7be09fcd62d0554d2e9273': {
      minInitialInvestment: '500000',
      apy: 'Target',
      apyPercentage: 4.086,
      weightedAverageMaturity: 49.42,
    },
  },
}
