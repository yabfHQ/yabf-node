import { YABFError } from '@yabf/common'

export class StreamClosedError extends YABFError {
    constructor(message: string = 'Attempted to write to a closed stream') {
        super({ code: 'STREAM_CLOSED', message })
    }
}
