import { ServiceError, Status } from '@yabf/common'

export class FramerError<TDetails = any> extends ServiceError<TDetails> {
    constructor(code: string, message: string, details: TDetails) {
        super({ status: Status.BAD_REQUEST, code, message, details })
    }
}
