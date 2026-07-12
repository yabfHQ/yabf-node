export interface IMetadata {
    get(key: string): string | undefined
    getAll(key: string): string[] | undefined

    set(key: string, value: string): void
    append(key: string, value: string): void

    has(key: string): boolean

    delete(key: string): boolean

    entries(): Iterable<[string, readonly string[]]>
    keys(): Iterable<string>
    values(): Iterable<readonly string[]>

    [Symbol.iterator](): IterableIterator<[string, readonly string[]]>
}
