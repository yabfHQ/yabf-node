import { Status } from '../constants'
import { IError } from './IError'
import { YABFError } from './YABFError'

export class ServiceError<TDetails = any> extends YABFError<TDetails> {
    readonly status: Status

    constructor(status: Status, error: IError<TDetails>) {
        super(error)

        this.status = status
    }
}
