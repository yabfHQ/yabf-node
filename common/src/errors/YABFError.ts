import { IError } from './IError'

export class YABFError<TDetails = any> extends Error implements IError<TDetails> {
    readonly code: string
    readonly details?: TDetails | undefined
    readonly cause?: Error | undefined

    constructor(error: IError<TDetails>) {
        super(error.message, { cause: error.cause })

        this.name = new.target.name

        this.code = error.code
        this.details = error.details
        this.cause = error.cause
    }
}
