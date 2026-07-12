import { Handler } from './Handler'

export interface Interceptor {
    (next: Handler): Handler
}

export function createInterceptor(interceptor: Interceptor): Interceptor {
    return interceptor
}
