export interface IError<TDetails = any> {
    readonly code: string
    readonly message?: string
    readonly details?: TDetails | undefined
    readonly cause?: Error | undefined
}
