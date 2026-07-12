import { CallContext } from '@yabf/context'
import { createInterceptorBase, Interceptor } from '@yabf/interceptors-base'

export function createInterceptor(interceptor: Interceptor<CallContext>): Interceptor<CallContext> {
    return createInterceptorBase(interceptor)
}
