import { AnyProcedure, Cardinality, Procedure } from '@yabf/contracts'

type OutputType<T extends AnyProcedure> =
    T extends Procedure<any, infer TOutput, any> ? TOutput : never

type OutputIsStream<T extends AnyProcedure> = T['output']['cardinality'] extends Cardinality.MANY
    ? true
    : false

export type ProcedureOutput<T extends AnyProcedure> =
    OutputIsStream<T> extends true
        ? AsyncGenerator<OutputType<T>>
        : OutputType<T> | Promise<OutputType<T>>
