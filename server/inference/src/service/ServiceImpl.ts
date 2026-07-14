import { AnyService, Service } from '@yabf/contracts'
import { ProcedureImpl } from '../procedure'

export type ServiceImpl<T extends AnyService> =
    T extends Service<any, infer TProcedures, any>
        ? { [K in keyof TProcedures]: ProcedureImpl<TProcedures[K]> }
        : never
