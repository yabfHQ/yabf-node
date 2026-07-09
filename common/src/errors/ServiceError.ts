import { Status } from '../constants'
import { IServiceError } from './IServiceError'

export class ServiceError<TData = any> extends Error {
    public readonly status: Status
    public readonly details: TData

    constructor(error: IServiceError<TData>)
    constructor(status: Status, code: string, message: string, data: TData, cause?: Error)
    constructor(
        ...args: [IServiceError<TData>] | [Status, string, string, TData, (Error | undefined)?]
    ) {
        const error: IServiceError<TData> =
            args.length === 1
                ? args[0]
                : {
                      status: args[0],
                      code: args[1],
                      message: args[2],
                      details: args[3],
                      cause: args[4]
                  }

        super(error.message, { cause: error.cause })

        this.status = error.status
        this.details = error.details
    }
}
