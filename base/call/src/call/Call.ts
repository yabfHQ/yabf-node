import { Stream } from '@yabf/stream'
import { RPCCapabilities, Transport } from '@yabf/transport'
import { Metadata } from '../metadata'

export interface Call {
    readonly service: string
    readonly procedure: string

    readonly transport: Transport<string, RPCCapabilities>
    readonly mediaType: string

    readonly signal: AbortSignal

    readonly metadata: Metadata
    readonly trailers: Metadata | Promise<Metadata>

    readonly messages: Stream<any>
}

export function createCall(
    service: string,
    procedure: string,
    {
        transport,
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
        transport,
        mediaType,
        signal,
        metadata,
        trailers,
        messages
    }
}
