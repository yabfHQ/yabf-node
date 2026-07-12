import { BaseCallContext, createBaseContext, Metadata } from '@yabf/context-base'

export interface CallContext extends BaseCallContext {
    request: {
        readonly streaming: boolean
        readonly metadata: Metadata
        readonly trailers: Promise<Metadata>
    }

    response: {
        readonly streaming: boolean
        readonly metadata: Metadata
        readonly trailers: Metadata
    }
}

export function createContext(context: Omit<CallContext, 'timeout'>): CallContext {
    return {
        ...createBaseContext(context),
        ...context
    }
}
