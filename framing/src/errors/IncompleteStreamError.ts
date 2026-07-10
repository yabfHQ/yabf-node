import { FramerError } from './FramerError'

export class IncompleteStreamError extends FramerError {
    constructor() {
        super('INCOMPLETE_STREAM', 'The stream completed without a stream end tag', {})
    }
}
