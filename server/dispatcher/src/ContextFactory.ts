import {
    Attributes,
    Call,
    CallContext,
    CallResponse,
    createContext,
    Metadata
} from '@yabf/server-call'

export interface PreContext {
    call: Call
    response: CallResponse
}

export function createCallContext({ call, response }: PreContext): CallContext {
    return createContext({
        call,
        response,
        attributes: new Attributes(),
        signal: call.signal,
        deadline: deadline(call.metadata)
    })
}

function deadline(metadata: Metadata): Date | undefined {
    if (!metadata.has('deadline')) return undefined

    const timestamp = parseInt(metadata.get('deadline')!)
    return new Date(timestamp)
}
