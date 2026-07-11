import { serializer, Serializer } from '@yabf/serialization'
import { JSONMediaTypes } from './JSONMediaTypes'

export interface JSONSerializer extends Serializer<'json', JSONMediaTypes> {}

export function json(): JSONSerializer {
    const encoder = new TextEncoder()

    return serializer('json', {
        mediaTypes: JSONMediaTypes,
        serialize(data) {
            return encoder.encode(JSON.stringify(data))
        },
        deserialize(data) {
            return JSON.parse(new TextDecoder().decode(data))
        }
    })
}
