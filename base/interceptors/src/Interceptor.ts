import { CallContext } from '@yabf/call'

export interface Interceptor<T extends CallContext> {
    (context: T, next: () => Promise<void>): Promise<void>
}

export function createInterceptor<T extends CallContext>(
    interceptor: Interceptor<T>
): Interceptor<T> {
    return interceptor
}
