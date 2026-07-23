import { Transport, transport } from '@yabf/transport'
import { HTTPCapabilities } from './HTTPCapabilities'
import { HTTPOptions } from './HTTPOptions'

export interface HTTPProtocol extends Transport<'http', HTTPCapabilities> {
    options: HTTPOptions
}

export function http({ pathPrefix = '/' }: HTTPOptions): HTTPProtocol {
    return {
        options: {
            pathPrefix
        },
        ...transport('http', HTTPCapabilities)
    } as const
}
