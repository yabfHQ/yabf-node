import { Message } from '@yabf/messages'
import { Stream } from '@yabf/stream'

export interface CallResponse {
    readonly mediaType: string
    readonly messages: Stream<Message>
}

export function response(mediaType: string, messages: Stream<Message>): CallResponse {
    return { mediaType, messages }
}
