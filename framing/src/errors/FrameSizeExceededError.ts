import { FramerError } from './FramerError'

export class FrameSizeExceededError extends FramerError<{
    maxFrameSize: string
    frameSize: string
}> {
    constructor(maxFrameSize: string, frameSize: string) {
        super(
            'FRAME_SIZE_EXCEEDED',
            `The frame size exceeds the max set limit, max: ${maxFrameSize}, size: ${frameSize}`,
            { maxFrameSize, frameSize }
        )
    }
}
