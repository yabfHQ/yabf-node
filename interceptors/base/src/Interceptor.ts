import { CallContext } from '@yabf/context'
import { Handler } from './Handler'

export interface Interceptor<T extends CallContext> {
    (next: Handler<T>): Handler<T>
}

export function createInterceptor<T extends CallContext>(
    interceptor: Interceptor<T>
): Interceptor<T> {
    return interceptor
}
