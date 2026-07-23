import { RPCCapabilities } from '@yabf/transport'

export const HTTPCapabilities: RPCCapabilities = {
    unary: true,
    serverStreaming: true,
    clientStreaming: true,
    bidiStreaming: false
} as const

export type HTTPCapabilities = typeof HTTPCapabilities
