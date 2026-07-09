export interface IServiceError<TData = any> {
    status: number
    code: string
    message: string
    data: TData
    cause?: Error | undefined
}
