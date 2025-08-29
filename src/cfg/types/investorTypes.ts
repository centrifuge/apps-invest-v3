import { Investor } from '@centrifuge/sdk'

export type Portfolio = Awaited<ReturnType<typeof Investor.prototype.portfolio>>
