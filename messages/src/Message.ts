import { InvalidMessagePayloadError } from './InvalidMessagePayloadError'
import { MessageType } from './MessageType'

export class Message {
    public readonly type: MessageType
    public readonly data?: Uint8Array | undefined

    constructor(type: MessageType, data?: Uint8Array | undefined) {
        this.type = type
        this.data = data
    }

    static from(payload: Uint8Array): Message {
        if (payload.length < 1) throw new InvalidMessagePayloadError()

        const type = payload[0] as MessageType
        const data = payload.length > 1 ? payload.subarray(1) : undefined

        return new Message(type, data)
    }

    toUint8Array(): Uint8Array {
        const payload = new Uint8Array((this.data?.length || 0) + 1)

        payload[0] = this.type
        if (this.data) payload.set(this.data, 1)

        return payload
    }
}
