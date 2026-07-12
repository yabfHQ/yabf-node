import { YABFError } from '@yabf/common'

export class MessagesConsumedError extends YABFError {
    constructor(message: string = 'Attempt to consumes messages that have already been consumed') {
        super({ code: 'MESSAGES_ALREADY_CONSUMED', message })
    }
}
