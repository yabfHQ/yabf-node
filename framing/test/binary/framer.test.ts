import { describe, expect, test } from 'vitest'
import {
    binaryFramer,
    BinaryFrames,
    FrameTagPosition,
    InvalidFrameTagError,
    TruncatedFrameError
} from '../../src'
import { FrameSizeExceededError } from '../../src/errors/FrameSizeExceededError'

function payload(bytes: number[]): Uint8Array {
    return new Uint8Array(bytes)
}

function frameSize(payloadSize: number): number {
    return BinaryFrames.frameSize(payloadSize)
}

async function* generator<T>(items: T[]): AsyncIterable<T> {
    for (const item of items) yield item
}

async function collect<T>(input: AsyncIterable<T>): Promise<T[]> {
    const output: T[] = []
    for await (const item of input) output.push(item)
    return output
}

describe('BinaryFramer', () => {
    describe('encode', () => {
        test('empty input', async () => {
            const framer = binaryFramer()
            const input = generator([])

            const frames = await collect(framer.encode(input))

            expect(frames).toEqual([])
        })

        test('encoding a payload', async () => {
            const framer = binaryFramer()
            const input = generator([payload([0xaa, 0xbb, 0xcc])])

            const frames = await collect(framer.encode(input))
            expect(frames).toHaveLength(1)

            const f = frames[0]!
            expect(f.length).toBe(frameSize(3))
            expect(f[0]).toBe(BinaryFrames.Tags.START)

            const view = new DataView(f.buffer)
            expect(view.getUint32(BinaryFrames.Header.LENGTH_OFFSET)).toBe(3)

            expect(f[BinaryFrames.PAYLOAD_OFFSET]).toBe(0xaa)
            expect(f[BinaryFrames.PAYLOAD_OFFSET + 1]).toBe(0xbb)
            expect(f[BinaryFrames.PAYLOAD_OFFSET + 2]).toBe(0xcc)

            expect(f[BinaryFrames.tailOffset(3)]).toBe(BinaryFrames.Tags.END)
        })

        test('payloads are encoded consistently', async () => {
            const framer = binaryFramer()
            const input = generator([payload([1, 2]), payload([1, 2])])

            const frames = await collect(framer.encode(input))

            expect(frames).toHaveLength(2)
            expect(frames[0]).toEqual(frames[1])
        })

        test('zero-length payloads', async () => {
            const framer = binaryFramer()
            const input = generator([payload([])])

            const frames = await collect(framer.encode(input))
            expect(frames).toHaveLength(1)

            const f = frames[0]!
            expect(f.length).toBe(frameSize(0))
            expect(f[0]).toBe(BinaryFrames.Tags.START)

            const view = new DataView(f.buffer)
            expect(view.getUint32(BinaryFrames.Header.LENGTH_OFFSET)).toBe(0)

            expect(f[BinaryFrames.tailOffset(0)]).toBe(BinaryFrames.Tags.END)
        })

        describe('multiple payloads', () => {
            test('encoding multiple payloads', async () => {
                const framer = binaryFramer()
                const input = generator([
                    payload([0x01]),
                    payload([0x02, 0x03]),
                    payload([0x04, 0x05, 0x06])
                ])

                const frames = await collect(framer.encode(input))
                expect(frames).toHaveLength(3)

                const sizes = frames.map(f => f.length)
                expect(sizes).toEqual([frameSize(1), frameSize(2), frameSize(3)])

                for (const f of frames) {
                    expect(f[0]).toBe(BinaryFrames.Tags.START)
                    expect(f[f.length - 1]).toBe(BinaryFrames.Tags.END)
                }
            })

            test.for([
                [10, 10],
                [20, 20],
                [50, 50]
            ])('%i payloads yield %i frames', async ([payloads, _frames]) => {
                const framer = binaryFramer()
                const input = generator(Array.from({ length: payloads }, (_, i) => payload([i])))

                const frames = await collect(framer.encode(input))

                expect(frames).toHaveLength(_frames)
            })
        })

        describe('errors', () => {
            test('frame size exceeding set maxFrameSize', async () => {
                const framer = binaryFramer({ maxFrameSize: 10 })
                const input = generator([payload([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])])

                await expect(collect(framer.encode(input))).rejects.toThrow(FrameSizeExceededError)
            })
        })
    })

    describe('decode', () => {
        test('empty input', async () => {
            const framer = binaryFramer()
            const input = generator([])

            const payloads = await collect(framer.decode(input))

            expect(payloads).toEqual([])
        })

        test('decoding a payload', async () => {
            const framer = binaryFramer()
            const payloads = [payload([0x10, 0x20, 0x30])]

            const input = generator(payloads)
            const frames = framer.encode(input)

            const decoded = await collect(framer.decode(frames))

            expect(decoded).toHaveLength(1)
            expect(decoded).toEqual(payloads)
        })

        test('zero-length payloads', async () => {
            const framer = binaryFramer()
            const payloads = [payload([])]

            const input = generator(payloads)
            const frames = framer.encode(input)

            const decoded = await collect(framer.decode(frames))

            expect(decoded).toHaveLength(1)
            expect(decoded).toEqual(payloads)
        })

        test('payloads decoded consistently', async () => {
            const framer = binaryFramer()
            const payloads = [payload([7, 8, 9, 10])]

            const input = generator(payloads)
            const frames = await collect(framer.encode(input))

            const decoded1 = await collect(framer.decode(generator(frames)))
            const decoded2 = await collect(framer.decode(generator(frames)))

            expect(decoded1).toEqual(decoded2)
        })

        describe('multiple frames', () => {
            test('decoding multiple frames', async () => {
                const framer = binaryFramer()
                const payloads = [
                    payload([0x01]),
                    payload([0x02, 0x03]),
                    payload([0x04, 0x05, 0x06])
                ]

                const input = generator(payloads)
                const frames = framer.encode(input)

                const decoded = await collect(framer.decode(frames))

                expect(decoded).toHaveLength(3)
                expect(decoded).toEqual(payloads)
            })

            test.for([
                [10, 10],
                [20, 20],
                [50, 50]
            ])('%i frames yield %i payloads', async ([nPayloads, nFrames]) => {
                const framer = binaryFramer()
                const payloads = Array.from({ length: nPayloads }, (_, i) => payload([i]))

                const input = generator(payloads)
                const frames = framer.encode(input)

                const decoded = await collect(framer.decode(frames))

                expect(decoded).toHaveLength(nFrames)
                expect(decoded).toEqual(payloads)
            })
        })

        describe('chunking', () => {
            function chunk(
                frames: Uint8Array[],
                splitPoints: number[] | ((frame: Uint8Array) => number[])
            ): Uint8Array[] {
                const chunks: Uint8Array[] = []

                for (const frame of frames) {
                    const points = Array.isArray(splitPoints) ? splitPoints : splitPoints(frame)

                    let offset = 0
                    for (const point of points.sort()) {
                        chunks.push(frame.slice(offset, point))
                        offset = point
                    }

                    chunks.push(frame.slice(offset))
                }

                return chunks
            }

            test('split mid-header', async () => {
                const framer = binaryFramer()
                const payloads = [payload([0x01, 0x02])]

                const input = generator(payloads)
                const chunks = await collect(framer.encode(input)).then(it =>
                    chunk(it, [BinaryFrames.Header.START_TAG_SIZE + 1])
                )

                const decoded = await collect(framer.decode(generator(chunks)))

                expect(decoded).toEqual(payloads)
            })

            test('split mid-payload', async () => {
                const framer = binaryFramer()
                const payloads = [payload([1, 2, 3, 4, 5, 6])]

                const input = generator(payloads)
                const chunks = await collect(framer.encode(input)).then(it =>
                    chunk(it, [BinaryFrames.Header.START_TAG_SIZE + 4])
                )

                const decoded = await collect(framer.decode(generator(chunks)))

                expect(decoded).toEqual(payloads)
            })

            test('split end tag', async () => {
                const framer = binaryFramer()
                const payloads = [payload([0x10, 0x20])]

                const input = generator(payloads)
                const chunks = await collect(framer.encode(input)).then(it =>
                    chunk(it, frame => [frame.length - 1])
                )

                const decoded = await collect(framer.decode(generator(chunks)))

                expect(decoded).toEqual(payloads)
            })

            test('single byte at a time', async () => {
                const framer = binaryFramer()
                const payloads = [payload([1, 2, 3])]

                const input = generator(payloads)
                const chunks = await collect(framer.encode(input)).then(it =>
                    chunk(it, frame => {
                        return Array.from({ length: frame.length }).map((_, i) => i)
                    })
                )

                const decoded = await collect(framer.decode(generator(chunks)))

                expect(decoded).toEqual(payloads)
            })

            test('multiple frames split across chunk boundaries', async () => {
                const framer = binaryFramer()
                const payloads = [
                    payload([0x01]),
                    payload([0x02, 0x03]),
                    payload([0x04, 0x05, 0x06])
                ]

                const input = generator(payloads)
                const chunks = await collect(framer.encode(input))
                    // concat
                    .then(frames => {
                        const totalLength = frames.reduce((sum, f) => sum + f.length, 0)
                        const merged = new Uint8Array(totalLength)

                        let offset = 0
                        for (const f of frames) {
                            merged.set(f, offset)
                            offset += f.length
                        }

                        return merged
                    })
                    // split
                    .then(merged => {
                        const chunks: Uint8Array[] = []

                        let pos = 0
                        while (pos < merged.length) {
                            const chunkSize = Math.min(3, merged.length - pos)
                            const chunk = merged.slice(pos, pos + chunkSize)

                            chunks.push(chunk)
                            pos += chunkSize
                        }

                        return chunks
                    })

                const decoded = await collect(framer.decode(generator(chunks)))

                expect(decoded).toEqual(payloads)
            })
        })

        describe('errors', () => {
            test.skip('invalid start tag', async () => {
                const framer = binaryFramer()
                const payloads = [payload([1, 2, 3])]

                const input = generator(payloads)
                const frames = await collect(framer.encode(input))

                const frame = frames[0]
                // set invalid start tag
                frame[BinaryFrames.Header.START_TAG_OFFSET] = 0xff

                const badFrames = generator([frame])

                /* TODO: `await collect(framer.decode(badFrames))` throws but this fails */
                await expect(collect(framer.decode(badFrames))).rejects.toThrow(
                    InvalidFrameTagError
                )

                await expect(collect(framer.decode(badFrames))).rejects.toMatchObject({
                    details: { position: FrameTagPosition.START }
                })
            })

            test.skip('invalid end tag', async () => {
                const framer = binaryFramer()
                const payloads = [payload([1, 2, 3])]

                const input = generator(payloads)
                const frames = await collect(framer.encode(input))

                const frame = frames[0]
                // set invalid end tag
                frame[frame.length - 1] = 0xff

                const badFrames = generator([frame])

                /* TODO: `await collect(framer.decode(badFrames))` throws but this fails */
                await expect(collect(framer.decode(badFrames))).rejects.toThrow(
                    InvalidFrameTagError
                )

                await expect(collect(framer.decode(badFrames))).rejects.toMatchObject({
                    details: { position: FrameTagPosition.END }
                })
            })

            test('frame exceeds set maxFrameSize', async () => {
                const encodeFramer = binaryFramer()
                const payloads = [
                    // payload that will produce a big frame
                    payload([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
                ]

                const input = generator(payloads)
                const frames = encodeFramer.encode(input)

                const framer = binaryFramer({ maxFrameSize: 10 })

                await expect(collect(framer.decode(frames))).rejects.toThrow(FrameSizeExceededError)
            })

            test('stream ending mid-frame', async () => {
                const framer = binaryFramer()
                const payloads = [payload([1]), payload([1, 2]), payload([1, 2, 3])]

                const input = generator(payloads)
                const frames = await collect(framer.encode(input))

                // truncate the last frame
                const frame = frames[frames.length - 1]!
                frames[frames.length - 1] = frame.slice(0, frame.length - 1)

                const badFrames = generator(frames)

                await expect(collect(framer.decode(badFrames))).rejects.toThrow(TruncatedFrameError)
            })
        })

        describe('round-trip', () => {
            test('encode and decode payloads back to original', async () => {
                const framer = binaryFramer()
                const payloads = [
                    payload([0x00, 0x01, 0x02]),
                    payload([]),
                    payload([0xff, 0xee]),
                    payload(new Array(256).map((_, i) => i % 256))
                ]

                const input = generator(payloads)
                const frames = await collect(framer.encode(input))

                const decoded = await collect(framer.decode(generator(frames)))

                expect(decoded).toEqual(payloads)
            })
        })
    })
})
