import { YABFError } from '@yabf/common'

export class NoMessageError extends YABFError {
    constructor(message: string = 'Expected a single message, but got none') {
        super({ code: 'NO_MESSAGE', message })
    }
}
