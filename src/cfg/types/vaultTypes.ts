import { Vault } from '@centrifuge/sdk'

export type Investment = Awaited<ReturnType<typeof Vault.prototype.investment>>
