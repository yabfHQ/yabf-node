import {
    Interceptor as BaseInterceptor,
    createInterceptor as createBaseInterceptor
} from '@yabf/interceptors-base'
import { CallContext } from '@yabf/server-call'

export interface Interceptor extends BaseInterceptor<CallContext> {}

export function createInterceptor(interceptor: Interceptor): Interceptor {
    return createBaseInterceptor(interceptor)
}
