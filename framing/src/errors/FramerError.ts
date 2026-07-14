import { YABFError } from '@yabf/common'

export class FramerError<TDetails = any> extends YABFError<TDetails> {
    constructor(code: string, message: string, details: TDetails) {
        super({ code, message, details })
    }
}
