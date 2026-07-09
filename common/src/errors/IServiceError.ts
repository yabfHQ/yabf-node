import { Status } from '../constants'

export interface IServiceError<TData = any> {
    status: Status
    code: string
    message: string
    details: TData
    cause?: Error | undefined
}
