import { RPCCapabilities } from './RPCCapabilities'

export interface Transport<TName extends string, TCapabilities extends RPCCapabilities> {
    name: TName
    capabilities: TCapabilities
}

export function transport<TName extends string, TCapabilities extends RPCCapabilities>(
    name: TName,
    capabilities: TCapabilities
): Transport<TName, TCapabilities> {
    return { name, capabilities } as const
}
