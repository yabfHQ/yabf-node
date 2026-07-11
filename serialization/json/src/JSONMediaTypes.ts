import { MediaTypes } from '@yabf/serialization'

export const JSONMediaTypes: MediaTypes = {
    unary: 'application/json',
    streaming: 'application/yabf+json'
}

export type JSONMediaTypes = typeof JSONMediaTypes
