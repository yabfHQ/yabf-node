import { Call as BaseCall, Metadata } from '@yabf/call'

export interface Call extends BaseCall {
    trailers: Promise<Metadata>
}
