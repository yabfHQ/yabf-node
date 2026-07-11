import { RPCCapabilities } from '@yabf/protocol'

export const HTTP2Capabilities: RPCCapabilities = {
    unary: true,
    serverStreaming: true,
    clientStreaming: true,
    bidiStreaming: false
} as const

export type HTTP2Capabilities = typeof HTTP2Capabilities
