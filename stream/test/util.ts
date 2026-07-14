export async function collect<T>(stream: AsyncIterable<T>): Promise<T[]> {
    const messages: T[] = []

    for await (const message of stream) {
        messages.push(message)
    }

    return messages
}

export function generate<T>(items: T[]): AsyncIterable<T> {
    return {
        async *[Symbol.asyncIterator]() {
            for (const item of items) {
                yield item
            }
        }
    }
}
