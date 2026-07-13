import { frameTags } from '../FrameTag'

export const BinaryFrames = {
    TAG_SIZE: 1,
    Tags: frameTags({ START: 0x01, END: 0x02 }),

    HEADER_OFFSET: 0,
    Header: {
        START_TAG_SIZE: 1,
        START_TAG_OFFSET: 0,

        TYPE_SIZE: 1,
        TYPE_OFFSET: 1,

        LENGTH_SIZE: 4,
        LENGTH_OFFSET: 2,

        SIZE: 6
    },

    PAYLOAD_OFFSET: 6,

    Tail: {
        END_TAG_SIZE: 1,
        END_TAG_OFFSET: 0,

        SIZE: 1
    },

    frameSize(payloadSize: number): number {
        return 6 + payloadSize + 1
    },

    tailOffset(payloadSize: number): number {
        return 6 + payloadSize
    }
}
