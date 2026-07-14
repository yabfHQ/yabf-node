import { Call as BaseCall, Metadata, createCall as createBaseCall } from '@yabf/call'

export interface Call extends BaseCall {
    trailers: Promise<Metadata>
}

export function createCall(
    service: string,
    procedure: string,
    call: Omit<Call, 'service' | 'procedure'>
): Call {
    return createBaseCall(service, procedure, call) as Call
}
