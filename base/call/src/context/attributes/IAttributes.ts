import { AttributeKey } from './AttributeKey'
import { AttributeValue } from './AttributeValue'

export interface IAttributes {
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
