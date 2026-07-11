import { MediaTypes } from './MediaTypes'

export interface Serializer<TName extends string, TMediaTypes extends MediaTypes> {
    name: TName
    mediaTypes: TMediaTypes

    serialize(data: unknown): Uint8Array
    deserialize(data: Uint8Array): unknown
}

export function serializer<TName extends string, TMediaTypes extends MediaTypes>(
    name: TName,
    { mediaTypes, serialize, deserialize }: Omit<Serializer<TName, TMediaTypes>, 'name'>
): Serializer<TName, TMediaTypes> {
    return {
        name,
        mediaTypes,
        serialize,
        deserialize
    }
}
