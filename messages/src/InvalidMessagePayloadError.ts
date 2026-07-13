import { YABFError } from '@yabf/common'

export class InvalidMessagePayloadError extends YABFError {
    constructor(message: string = 'Invalid message payload') {
        super({ code: 'INVALID_MESSAGE', message })
    }
}
