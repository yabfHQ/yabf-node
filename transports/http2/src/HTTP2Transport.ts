import { transport, Transport } from '@yabf/transport'
import { HTTP2Capabilities } from './HTTP2Capabilities'
import { HTTP2Options } from './HTTP2Options'

export interface HTTP2Transport extends Transport<'http2', HTTP2Capabilities> {
    options: HTTP2Options
}

export function http2({ pathPrefix = '/' }: HTTP2Options): HTTP2Transport {
    return {
        options: {
            pathPrefix
        },
        ...transport('http2', HTTP2Capabilities)
    } as const
}
