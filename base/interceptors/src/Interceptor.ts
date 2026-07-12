import { BaseCallContext } from '@yabf/context-base'
import { Handler } from './Handler'

export interface Interceptor<T extends BaseCallContext> {
    (next: Handler<T>): Handler<T>
}

export function createInterceptorBase<T extends BaseCallContext>(
    interceptor: Interceptor<T>
): Interceptor<T> {
    return interceptor
}
