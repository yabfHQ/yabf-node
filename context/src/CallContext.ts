import { Protocol, RPCCapabilities } from '@yabf/protocol'
import { MediaTypes, Serializer } from '@yabf/serialization'
import { Attributes } from './attributes'
import { Metadata } from './metadata'

export interface CallContext {
    readonly service: string
    readonly procedure: string

    readonly protocol: Protocol<string, RPCCapabilities>
    readonly serializer: Serializer<string, MediaTypes>

    readonly attributes: Attributes

    readonly request: {
        readonly streaming: boolean
        readonly metadata: Metadata
        readonly trailers: Metadata
    }

    readonly response: {
        readonly streaming: boolean
        readonly metadata: Metadata
        readonly trailers: Metadata
    }

    readonly signal: AbortSignal

    readonly deadline?: Date | undefined
    readonly timeout: number | undefined
}

export function createContext(context: Omit<CallContext, 'timeout'>): CallContext {
    return {
        ...context,
        get timeout() {
            const deadline = context.deadline
            if (!deadline) return undefined

            return Math.max(0, deadline.getTime() - Date.now())
        }
    }
}
