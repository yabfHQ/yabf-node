import { YABFError } from '@yabf/common'

export class StreamConsumedError extends YABFError {
    constructor(message: string = 'Attempt to consume an already consumed stream') {
        super({ code: 'MESSAGES_ALREADY_CONSUMED', message })
    }
}
