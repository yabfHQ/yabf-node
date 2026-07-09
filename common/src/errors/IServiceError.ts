export interface IServiceError<TData = any> {
    status: number
    message: string
    data: TData
    cause?: Error | undefined
}
