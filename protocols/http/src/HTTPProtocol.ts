import { protocol, Protocol } from '@yabf/protocol'
import { HTTPCapabilities } from './HTTPCapabilities'
import { HTTPOptions } from './HTTPOptions'

export interface HTTPProtocol extends Protocol<'http', HTTPCapabilities> {
    options: HTTPOptions
}

export function http({ pathPrefix = '/' }: HTTPOptions): HTTPProtocol {
    return {
        options: {
            pathPrefix
        },
        ...protocol('http', HTTPCapabilities)
    } as const
}
