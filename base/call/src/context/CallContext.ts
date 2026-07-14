import { Call } from '../call'
import { CallResponse } from '../response'
import { Attributes } from './attributes'

export interface CallContext<TCall extends Call, TResponse extends CallResponse> {
    readonly call: TCall
    readonly response: TResponse

    readonly attributes: Attributes

    readonly signal: AbortSignal

    readonly deadline?: Date | undefined
    readonly timeout: number | undefined
}
