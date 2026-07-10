import { FramerError } from './FramerError'

export class TruncatedFrameError extends FramerError {
    constructor() {
        super('INCOMPLETE_STREAM', 'The stream completed without a stream end tag', {})
    }
}
