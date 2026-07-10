import { Status } from '../constants'

export interface IServiceError<TData = any> {
    code: string
    message?: string | undefined
    status?: Status | undefined
    details?: TData | undefined
    cause?: Error | undefined
}
