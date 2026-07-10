import { frameTags } from '../FrameTag'

export const BinaryFrame = {
    TAG_SIZE: 1,
    Tags: frameTags({ START: 0x01, END: 0x02, STREAM_END: 0x03 }),

    HEADER_OFFSET: 0,
    Header: {
        START_TAG_SIZE: 1,
        START_TAG_OFFSET: 0,

        LENGTH_SIZE: 4,
        LENGTH_OFFSET: 1,

        SIZE: 5
    },

    PAYLOAD_OFFSET: 5,

    Tail: {
        END_TAG_SIZE: 1,
        END_TAG_OFFSET: 0,

        SIZE: 1
    },

    frameSize(payloadSize: number): number {
        return 5 + payloadSize + 1
    },

    tailOffset(payloadSize: number): number {
        return 5 + payloadSize
    }
}
