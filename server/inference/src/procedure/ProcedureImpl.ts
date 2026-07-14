import { AnyProcedure } from '@yabf/contracts'
import { CallContext } from '@yabf/server-call'
import { ProcedureInput } from './ProcedureInput'
import { ProcedureOutput } from './ProcedureOutput'

export interface ProcedureImpl<T extends AnyProcedure> {
    (context: CallContext, input: ProcedureInput<T>): ProcedureOutput<T>
}
