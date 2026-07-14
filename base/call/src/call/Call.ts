import { Message } from '@yabf/messages'
import { Protocol, RPCCapabilities } from '@yabf/protocol'
import { Stream } from '@yabf/stream'

export interface Call {
    readonly service: string
    readonly procedure: string

    readonly protocol: Protocol<string, RPCCapabilities>
    readonly mediaType: string

    readonly signal: AbortSignal

    readonly messages: Stream<Message>
}

export function call(
    service: string,
    procedure: string,
    { protocol, mediaType, signal, messages }: Omit<Call, 'service' | 'procedure'>
): Call {
    return {
        service,
        procedure,
        protocol,
        mediaType,
        signal,
        messages
    }
}
