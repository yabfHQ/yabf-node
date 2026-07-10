import { ServiceError, Status } from '@yabf/common'

export class FrameSizeExceededError extends ServiceError<{
    maxFrameSize: string
    frameSize: string
}> {
    constructor(maxFrameSize: string, frameSize: string) {
        super(
            Status.RESOURCE_EXHAUSTED,
            'FRAME_SIZE_EXCEEDED',
            `The frame size exceeds the max set limit, max: ${maxFrameSize}, size: ${frameSize}`,
            { maxFrameSize, frameSize }
        )
    }
}
