import { describe, expect, test } from 'vitest'
import { Stream, StreamConsumedError } from '../src'
import { collect, generate } from './util'

describe('Stream', () => {
    test('streaming messages', async () => {
        const stream = new Stream(generate([1, 2, 3]))

        const messages = await collect(stream)

        expect(messages).toEqual([1, 2, 3])
    })

    test('tapping messages', async () => {
        const stream = new Stream(generate([1, 2, 3]))

        const tapped: number[] = []
        stream.tap(message => {
            tapped.push(message)
        })

        await collect(stream)

        expect(tapped).toEqual([1, 2, 3])
    })

    test('filtering messages', async () => {
        const stream = new Stream(generate([1, 2, 3]))

        const filtered = stream.filter(message => message % 2 === 0)
        const messages = await collect(filtered)

        expect(messages).toEqual([2])
    })

    test('mapping messages', async () => {
        const stream = new Stream(generate([1, 2, 3]))

        const mapped = stream.map(message => message * 2)
        const messages = await collect(mapped)

        expect(messages).toEqual([2, 4, 6])
    })

    test('first message', async () => {
        const stream = new Stream(generate([1, 2, 3]))

        const first = await stream.first()

        expect(first).toEqual(1)
    })

    test('consuming from a consumed stream', async () => {
        const stream = Stream.from(async function* () {
            yield 1
            yield 2
            yield 3
        })

        const first = await stream.first()

        expect(first).toEqual(1)

        await expect(stream.first()).rejects.toThrow(StreamConsumedError)
    })
})
