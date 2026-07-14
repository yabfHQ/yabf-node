import { Stream } from '@yabf/stream'
import { Metadata } from '../metadata'

export interface CallResponse {
    readonly mediaType: string

    readonly metadata: Metadata
    readonly trailers: Metadata | Promise<Metadata>

    readonly messages: Stream<any>
}

export function response(response: CallResponse): CallResponse {
    return response
}
