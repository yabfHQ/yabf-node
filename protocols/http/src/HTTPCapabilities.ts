import { RPCCapabilities } from '@yabf/protocol'

export const HTTPCapabilities: RPCCapabilities = {
    unary: true,
    serverStreaming: true,
    clientStreaming: true,
    bidiStreaming: false
} as const

export type HTTPCapabilities = typeof HTTPCapabilities
