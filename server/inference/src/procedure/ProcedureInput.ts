import { AnyProcedure, Cardinality, Procedure } from '@yabf/contracts'

type InputType<T extends AnyProcedure> =
    T extends Procedure<infer TInput, any, any> ? TInput : never

type InputIsStream<T extends AnyProcedure> = T['input']['cardinality'] extends Cardinality.MANY
    ? true
    : false

export type ProcedureInput<T extends AnyProcedure> =
    InputIsStream<T> extends true ? AsyncGenerator<InputType<T>> : InputType<T>
