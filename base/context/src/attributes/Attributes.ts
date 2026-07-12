import { AttributeKey } from './AttributeKey'
import { AttributeValue } from './AttributeValue'

export interface Attributes {
    get<T, K extends AttributeKey<T>>(key: K): AttributeValue<T, K>
    set<T>(key: AttributeKey<T>, value: T): void

    has(key: AttributeKey<unknown>): boolean
    delete<T>(key: AttributeKey<T>): boolean

    readonly size: number

    entries(): Iterable<[AttributeKey<unknown>, unknown]>
    keys(): Iterable<AttributeKey<unknown>>
    values(): Iterable<unknown>

    [Symbol.iterator](): IterableIterator<[AttributeKey<unknown>, unknown]>
}

export function attributes(): Attributes {
    const entries = new Map<AttributeKey<any>, any>()

    return {
        get(key) {
            return entries.has(key) ? entries.get(key) : key.defaultValue
        },
        set(key, value) {
            entries.set(key, value)
        },

        has(key) {
            return entries.has(key)
        },
        delete(key) {
            return entries.delete(key)
        },

        get size() {
            return entries.size
        },

        entries() {
            return entries.entries()
        },
        keys() {
            return entries.keys()
        },
        values() {
            return entries.values()
        },

        [Symbol.iterator]() {
            return entries[Symbol.iterator]()
        }
    }
}

export { attributes as createAttributes }
