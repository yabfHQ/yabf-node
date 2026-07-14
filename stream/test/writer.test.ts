import { describe, expect, test } from 'vitest'
import { StreamClosedError, StreamWriter } from '../src'

async function collect<T>(stream: AsyncIterable<T>): Promise<T[]> {
    const messages: T[] = []

    for await (const message of stream) {
        messages.push(message)
    }

    return messages
}

describe('StreamWriter', () => {
    test('writing messages', async () => {
        const writer = new StreamWriter()
        writer.yield(1)
        writer.yield(2)
        writer.yield(3)
        writer.close()

        const messages = await collect(writer)

        expect(messages).toEqual([1, 2, 3])
    })

    test('writing messages aster closing', async () => {
        const writer = new StreamWriter()
        writer.yield(1)
        writer.close()

        expect(() => writer.yield(2)).toThrow(StreamClosedError)
    })
})
