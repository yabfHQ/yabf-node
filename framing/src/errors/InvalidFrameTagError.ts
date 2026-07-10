import { FrameTagPosition } from '../FrameTagPosition'
import { FramerError } from './FramerError'

export class InvalidFrameTagError extends FramerError<{
    expected: string
    actual: string
    position: FrameTagPosition
}> {
    constructor(expected: string, actual: string, position: FrameTagPosition) {
        super(
            `INVALID_FRAME_${position}_TAG`,
            `Invalid frame tag, expected: ${expected}, actual: ${actual} at frame ${position}`,
            { expected, actual, position }
        )
    }
}
