import { describe, expect, it } from 'vitest'
import { growableBuffer } from '../../src/binary/GrowableBuffer' // or your test framework

describe('growableBuffer', () => {
    describe('append', () => {
        it('should append data to an empty buffer', () => {
            const buf = growableBuffer()

            buf.append(new Uint8Array([1, 2, 3]))

            expect(buf.available).toBe(3)
            expect(buf.byteAt(0)).toBe(1)
            expect(buf.byteAt(1)).toBe(2)
            expect(buf.byteAt(2)).toBe(3)
        })

        it('should append multiple chunks sequentially', () => {
            const buf = growableBuffer()

            buf.append(new Uint8Array([1, 2]))
            buf.append(new Uint8Array([3, 4]))

            expect(buf.available).toBe(4)
            expect(buf.byteAt(2)).toBe(3)
            expect(buf.byteAt(3)).toBe(4)
        })

        it('should grow when total data exceeds capacity', () => {
            const buf = growableBuffer(4)
            buf.append(new Uint8Array([1, 2, 3, 4]))

            // append more, exceeding capacity
            buf.append(new Uint8Array([5, 6]))

            expect(buf.available).toBe(6)
            expect(buf.slice(0, 6)).toEqual(new Uint8Array([1, 2, 3, 4, 5, 6]))
        })

        it('should compact and grow when unread + new > capacity but new <= free space', () => {
            const buf = growableBuffer(8)
            buf.append(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]))
            buf.consume(4) // unread = 4, readOffset = 4

            // free space = 4, but we need 4 + 5 = 9 > 8
            // Should compact (move [5,6,7,8] to front), then grow
            buf.append(new Uint8Array([9, 10, 11, 12, 13]))

            expect(buf.available).toBe(9)
            expect(buf.slice(0, 9)).toEqual(new Uint8Array([5, 6, 7, 8, 9, 10, 11, 12, 13]))
        })

        it('should compact without growing when enough free space exists', () => {
            const buf = growableBuffer(8)
            buf.append(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]))
            buf.consume(6) // unread = 2, readOffset = 6, free space = 6

            buf.append(new Uint8Array([9, 10, 11])) // 2 + 3 = 5 <= 8, but need compaction

            expect(buf.available).toBe(5)
            expect(buf.slice(0, 5)).toEqual(new Uint8Array([7, 8, 9, 10, 11]))
        })

        it('should handle appending empty chunk', () => {
            const buf = growableBuffer()

            buf.append(new Uint8Array([]))

            expect(buf.available).toBe(0)
        })

        it('should handle growth when required size is more than double', () => {
            const buf = growableBuffer(4)
            buf.append(new Uint8Array([1, 2, 3, 4]))

            // Need 4 + 10 = 14, double to 8 (still < 14), double to 16
            buf.append(new Uint8Array([5, 6, 7, 8, 9, 10, 11, 12, 13, 14]))

            expect(buf.available).toBe(14)
        })
    })

    describe('available', () => {
        it('should return 0 for empty buffer', () => {
            expect(growableBuffer().available).toBe(0)
        })

        it('should decrease after consume', () => {
            const buf = growableBuffer()
            buf.append(new Uint8Array([1, 2, 3]))
            buf.consume(2)

            expect(buf.available).toBe(1)
        })

        it('should not go negative', () => {
            const buf = growableBuffer()
            buf.append(new Uint8Array([1]))
            buf.consume(1)

            expect(buf.available).toBe(0)
        })
    })

    describe('byteAt', () => {
        it('should return byte at given index', () => {
            const buf = growableBuffer()
            buf.append(new Uint8Array([10, 20, 30]))

            expect(buf.byteAt(0)).toBe(10)
            expect(buf.byteAt(1)).toBe(20)
            expect(buf.byteAt(2)).toBe(30)
        })

        it('should account for consumed bytes', () => {
            const buf = growableBuffer()
            buf.append(new Uint8Array([10, 20, 30]))
            buf.consume(1)

            expect(buf.byteAt(0)).toBe(20)
            expect(buf.byteAt(1)).toBe(30)
        })

        it('should throw for out-of-bounds index', () => {
            const buf = growableBuffer()
            buf.append(new Uint8Array([1]))

            expect(() => buf.byteAt(5)).toThrow(RangeError)
            expect(() => buf.byteAt(-1)).toThrow(RangeError)
        })
    })

    describe('view', () => {
        it('should return a DataView of unread data', () => {
            const buf = growableBuffer()
            buf.append(new Uint8Array([0x01, 0x02, 0x03, 0x04]))

            const view = buf.view()

            expect(view.byteLength).toBe(4)
            expect(view.getUint8(0)).toBe(0x01)
            expect(view.getUint16(0, false)).toBe(0x0102)
        })

        it('should reflect consumed offset', () => {
            const buf = growableBuffer()
            buf.append(new Uint8Array([0x01, 0x02, 0x03, 0x04]))
            buf.consume(2)

            const view = buf.view()

            expect(view.byteLength).toBe(2)
            expect(view.getUint8(0)).toBe(0x03)
        })

        it('should share underlying buffer but respect boundaries', () => {
            const buf = growableBuffer(8)
            buf.append(new Uint8Array([1, 2, 3, 4]))

            const view = buf.view()

            // View should only see the 4 bytes, not the full capacity
            expect(view.byteLength).toBe(4)
        })

        it('should handle empty buffer', () => {
            const buf = growableBuffer()

            const view = buf.view()

            expect(view.byteLength).toBe(0)
        })
    })

    describe('slice', () => {
        it('should return a copy of the specified range', () => {
            const buf = growableBuffer()
            buf.append(new Uint8Array([1, 2, 3, 4, 5]))

            const sliced = buf.slice(1, 4)

            expect(sliced).toEqual(new Uint8Array([2, 3, 4]))
        })

        it('should not affect original buffer when modifying slice', () => {
            const buf = growableBuffer()
            buf.append(new Uint8Array([1, 2, 3]))

            const sliced = buf.slice(0, 2)
            sliced[0] = 99

            expect(buf.byteAt(0)).toBe(1)
        })

        it('should account for consumed offset', () => {
            const buf = growableBuffer()
            buf.append(new Uint8Array([1, 2, 3, 4, 5]))
            buf.consume(2)

            expect(buf.slice(0, 2)).toEqual(new Uint8Array([3, 4]))
        })

        it('should handle start === end', () => {
            const buf = growableBuffer()
            buf.append(new Uint8Array([1, 2, 3]))

            expect(buf.slice(1, 1)).toEqual(new Uint8Array([]))
        })
    })

    describe('consume', () => {
        it('should advance read offset', () => {
            const buf = growableBuffer()
            buf.append(new Uint8Array([1, 2, 3, 4]))

            buf.consume(2)

            expect(buf.available).toBe(2)
            expect(buf.byteAt(0)).toBe(3)
        })

        it('should handle consuming all data', () => {
            const buf = growableBuffer()
            buf.append(new Uint8Array([1, 2]))

            buf.consume(2)

            expect(buf.available).toBe(0)
        })

        it('should handle consuming 0', () => {
            const buf = growableBuffer()
            buf.append(new Uint8Array([1, 2]))

            buf.consume(0)

            expect(buf.available).toBe(2)
        })

        it('should throw when n > available', () => {
            const buf = growableBuffer()
            buf.append(new Uint8Array([1]))

            expect(() => buf.consume(5)).toThrow(RangeError)
        })

        it('should throw for negative n', () => {
            const buf = growableBuffer()
            buf.append(new Uint8Array([1, 2]))

            expect(() => buf.consume(-1)).toThrow(RangeError)
        })
    })

    describe('integration scenarios', () => {
        it('should handle typical streaming parse workflow', () => {
            const buf = growableBuffer(8)

            // Receiving data in chunks
            buf.append(new Uint8Array([0x00, 0x01]))
            expect(buf.available).toBe(2)

            // Parse a 2-byte header
            const header = buf.view().getUint16(0, false)
            expect(header).toBe(0x0001)
            buf.consume(2)

            // More data arrives
            buf.append(new Uint8Array([0x02, 0x03, 0x04, 0x05]))
            expect(buf.available).toBe(4)

            // Parse payload
            expect(buf.slice(0, 4)).toEqual(new Uint8Array([0x02, 0x03, 0x04, 0x05]))
            buf.consume(4)

            expect(buf.available).toBe(0)
        })

        it('should handle repeated compact-and-grow cycles', () => {
            const buf = growableBuffer(4)

            for (let i = 0; i < 10; i++) {
                buf.append(new Uint8Array([i]))
                buf.consume(1)
            }

            // After many cycles, buffer should still work
            buf.append(new Uint8Array([10, 11, 12]))

            expect(buf.available).toBe(3)
            expect(buf.slice(0, 3)).toEqual(new Uint8Array([10, 11, 12]))
        })

        it('should handle large append after many small consumes', () => {
            const buf = growableBuffer(8)

            buf.append(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]))
            buf.consume(7) // only 1 byte left at end

            // This should compact, not grow
            buf.append(new Uint8Array([9, 10, 11, 12, 13, 14, 15]))

            expect(buf.available).toBe(8)
            expect(buf.slice(0, 8)).toEqual(new Uint8Array([8, 9, 10, 11, 12, 13, 14, 15]))
        })
    })
})
