import { IMetadata } from './IMetadata'

export class Metadata implements IMetadata {
    private readonly metadata: Map<string, string[]>

    constructor(metadata: Iterable<[string, string[]]> = []) {
        this.metadata = new Map(metadata)
    }

    get(key: string): string | undefined {
        const value = this.metadata.get(normalize(key))?.[0]
        return typeof value === 'string' ? value : undefined
    }

    getAll(key: string): string[] | undefined {
        return this.metadata.get(normalize(key))
    }

    set(key: string, value: string): void {
        this.metadata.set(normalize(key), [value])
    }

    append(key: string, value: string): void {
        const values = this.metadata.get(normalize(key)) ?? []
        values.push(value)

        this.metadata.set(normalize(key), values)
    }

    has(key: string): boolean {
        return this.metadata.has(normalize(key))
    }

    delete(key: string): boolean {
        return this.metadata.delete(normalize(key))
    }

    entries(): Iterable<[string, readonly string[]]> {
        return this.metadata.entries()
    }

    keys(): Iterable<string> {
        return this.metadata.keys()
    }

    values(): Iterable<readonly string[]> {
        return this.metadata.values()
    }

    [Symbol.iterator](): IterableIterator<[string, readonly string[]]> {
        return this.metadata[Symbol.iterator]()
    }
}

function normalize(key: string): string {
    return key.toLowerCase()
}
