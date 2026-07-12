import { MetadataValue } from './MetadataValue'

export interface Metadata {
    get(key: string): string | undefined
    getBinary(key: string): Uint8Array | undefined
    getAll(key: string): MetadataValue[] | undefined

    set(key: string, value: MetadataValue): void
    append(key: string, value: MetadataValue): void

    setBinary(key: string, value: Uint8Array): void
    appendBinary(key: string, value: Uint8Array): void

    has(key: string): boolean
    delete(key: string): boolean

    entries(): Iterable<[string, readonly MetadataValue[]]>
    keys(): Iterable<string>
    values(): Iterable<readonly MetadataValue[]>

    [Symbol.iterator](): IterableIterator<[string, readonly MetadataValue[]]>
}

export function metadata(): Metadata {
    const entries = new Map<string, MetadataValue[]>()

    const getValues = (key: string) => entries.get(normalize(key))
    const setValues = (key: string, values: MetadataValue[]) => entries.set(normalize(key), values)
    const deleteValues = (key: string) => entries.delete(normalize(key))

    return {
        get(key) {
            const value = getValues(key)?.[0]
            return typeof value === 'string' ? value : undefined
        },
        getBinary(key) {
            const value = getValues(key)?.[0] as Uint8Array | undefined
            return value instanceof Uint8Array ? value : undefined
        },
        getAll(key) {
            return getValues(key)
        },

        set(key, value) {
            setValues(key, [value])
        },
        append(key, value) {
            const values = getValues(key) ?? []
            values.push(value)
            setValues(key, values)
        },

        setBinary(key, value) {
            setValues(key, [value])
        },
        appendBinary(key, value) {
            const values = getValues(key) ?? []
            values.push(value)
            setValues(key, values)
        },

        has(key) {
            return entries.has(normalize(key))
        },
        delete(key) {
            return deleteValues(key)
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

export { metadata as createMetadata }

function normalize(key: string): string {
    return key.toLowerCase()
}
