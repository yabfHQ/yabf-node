import { AnyProcedure, Cardinality } from '@yabf/contracts'
import { ProcedureImpl } from '@yabf/inference'
import { CallContext } from '@yabf/server-call'
import { StreamWriter } from '@yabf/stream'

export interface Handler {
    (context: CallContext, writer: StreamWriter<unknown>): Promise<void>
}

export function createHandler(procedure: AnyProcedure, impl: ProcedureImpl<AnyProcedure>): Handler {
    return async (context, writer) => {
        const input =
            procedure.input.cardinality === Cardinality.ONE
                ? await context.call.messages.first()
                : context.call.messages

        const output = impl(context, input)

        try {
            if (procedure.output.cardinality === Cardinality.ONE) {
                writer.yield(await output)
            } else {
                for await (const it of output as AsyncIterable<unknown>) {
                    writer.yield(it)
                }
            }
        } finally {
            writer.close()
        }
    }
}
