import { RPCCapabilities } from './RPCCapabilities'

export interface Protocol<TName extends string, TCapabilities extends RPCCapabilities> {
    name: TName
    capabilities: TCapabilities
}

export function protocol<TName extends string, TCapabilities extends RPCCapabilities>(
    name: TName,
    capabilities: TCapabilities
): Protocol<TName, TCapabilities> {
    return { name, capabilities } as const
}
