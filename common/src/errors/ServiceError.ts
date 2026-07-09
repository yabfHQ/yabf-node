import { Status } from '../constants'
import { IServiceError } from './IServiceError'

export class ServiceError<TData = any> extends Error {
    public readonly status: Status
    public readonly data: TData

    constructor(error: IServiceError<TData>)
    constructor(status: Status, message: string, data: TData, cause?: Error)
    constructor(...args: [IServiceError<TData>] | [Status, string, TData, (Error | undefined)?]) {
        const error: IServiceError<TData> =
            args.length === 1
                ? args[0]
                : {
                      status: args[0],
                      message: args[1],
                      data: args[2],
                      cause: args[3]
                  }

        super(error.message, { cause: error.cause })

        this.status = error.status
        this.data = error.data
    }
}
