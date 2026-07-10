import { ServiceError } from '@yabf/common'

export class FramerError<TDetails = any> extends ServiceError<TDetails> {
    constructor(code: string, message: string, details: TDetails) {
        super({ code, message, details })
    }
}
