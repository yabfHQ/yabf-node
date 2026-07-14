import { Call } from '../call'
import { CallResponse } from '../response'
import { Attributes } from './attributes'

export interface CallContext<
    TCall extends Call = Call,
    TResponse extends CallResponse = CallResponse
> {
    readonly call: TCall
    readonly response: TResponse

    readonly attributes: Attributes

    readonly signal: AbortSignal

    readonly deadline?: Date | undefined
    readonly timeout: number | undefined
}

export function createContext<
    TCall extends Call = Call,
    TResponse extends CallResponse = CallResponse
>(context: Omit<CallContext<TCall, TResponse>, 'timeout'>): CallContext<TCall, TResponse> {
    return {
        ...context,
        get timeout() {
            return context.deadline ? Date.now() - context.deadline.getTime() : undefined
        }
    }
}
