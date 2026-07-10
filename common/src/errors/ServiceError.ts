import { Status } from '../constants'
import { IServiceError } from './IServiceError'

export class ServiceError<TData = any> extends Error implements IServiceError<TData> {
    public readonly code: string
    public readonly status?: Status | undefined
    public readonly details?: TData | undefined
    public readonly cause?: Error | undefined

    constructor(error: IServiceError<TData>)
    constructor(code: string, message?: string, status?: Status, data?: TData, cause?: Error)
    constructor(
        ...args:
            | [IServiceError<TData>]
            | [
                  string,
                  (string | undefined)?,
                  (Status | undefined)?,
                  (TData | undefined)?,
                  (Error | undefined)?
              ]
    ) {
        const error: IServiceError<TData> =
            typeof args[0] === 'object'
                ? args[0]
                : {
                      code: args[0],
                      message: args[1],
                      status: args[2],
                      details: args[3],
                      cause: args[4]
                  }

        super(error.message, { cause: error.cause })

        this.status = error.status
        this.code = error.code
        this.details = error.details
        this.cause = error.cause
    }
}
