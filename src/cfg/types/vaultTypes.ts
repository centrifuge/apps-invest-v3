import { Observable } from 'rxjs'
import { Vault } from '@centrifuge/sdk'

type ObservableType<T> = T extends Observable<infer U> ? U : never
export type Investment = ObservableType<ReturnType<typeof Vault.prototype.investment>>
