import { AttributeKey, AttributeKeyWithDefault } from './AttributeKey'

export type AttributeValue<T, K extends AttributeKey<T>> =
    K extends AttributeKeyWithDefault<T> ? T : T | undefined
