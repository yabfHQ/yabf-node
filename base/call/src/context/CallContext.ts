import { Call } from '../call'
import { CallResponse } from '../response'
import { Attributes } from './attributes'

export interface CallContext {
    readonly call: Call
    readonly response: CallResponse

    readonly attributes: Attributes

    readonly signal: AbortSignal

    readonly deadline?: Date | undefined
    readonly timeout: number | undefined
}
