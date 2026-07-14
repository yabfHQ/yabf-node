import { Protocol, RPCCapabilities } from '@yabf/protocol'
import { Stream } from '@yabf/stream'
import { Metadata } from '../context'

export interface Call {
    readonly service: string
    readonly procedure: string

    readonly protocol: Protocol<string, RPCCapabilities>
    readonly mediaType: string

    readonly signal: AbortSignal

    readonly metadata: Metadata
    readonly trailers: Metadata | Promise<Metadata>

    readonly messages: Stream<any>
}

export function call(
    service: string,
    procedure: string,
    {
        protocol,
        mediaType,
        signal,
        metadata,
        trailers,
        messages
    }: Omit<Call, 'service' | 'procedure'>
): Call {
    return {
        service,
        procedure,
        protocol,
        mediaType,
        signal,
        metadata,
        trailers,
        messages
    }
}
