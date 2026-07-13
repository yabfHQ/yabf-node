import { AttributeKey } from './AttributeKey'
import { AttributeValue } from './AttributeValue'
import { IAttributes } from './IAttributes'

export class Attributes implements IAttributes {
    private readonly attributes = new Map<AttributeKey<any>, any>()

    get<T, K extends AttributeKey<T>>(key: K): AttributeValue<T, K> {
        return this.attributes.has(key)
            ? this.attributes.get(key)
            : (key.defaultValue as AttributeValue<T, K>)
    }

    set<T>(key: AttributeKey<T>, value: T) {
        this.attributes.set(key, value)
    }

    has(key: AttributeKey<unknown>) {
        return this.attributes.has(key)
    }

    delete(key: AttributeKey<unknown>) {
        return this.attributes.delete(key)
    }

    get size() {
        return this.attributes.size
    }

    entries(): Iterable<[AttributeKey<unknown>, unknown]> {
        return this.attributes.entries()
    }

    keys(): Iterable<AttributeKey<unknown>> {
        return this.attributes.keys()
    }

    values(): Iterable<unknown> {
        return this.attributes.values()
    }

    [Symbol.iterator](): IterableIterator<[AttributeKey<unknown>, unknown]> {
        return this.attributes[Symbol.iterator]()
    }
}
