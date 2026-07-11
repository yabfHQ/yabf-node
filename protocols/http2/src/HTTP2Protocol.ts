import { protocol, Protocol } from '@yabf/protocol'
import { HTTP2Capabilities } from './HTTP2Capabilities'
import { HTTP2Options } from './HTTP2Options'

export interface HTTP2Protocol extends Protocol<'http2', HTTP2Capabilities> {
    options: HTTP2Options
}

export function http2({ pathPrefix = '/' }: HTTP2Options): HTTP2Protocol {
    return {
        options: {
            pathPrefix
        },
        ...protocol('http2', HTTP2Capabilities)
    } as const
}
