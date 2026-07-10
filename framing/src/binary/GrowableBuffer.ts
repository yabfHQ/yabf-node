export interface GrowableBuffer {
    append(chunk: Uint8Array): void
    readonly available: number
    byteAt(i: number): number
    view(): DataView
    slice(start: number, end: number): Uint8Array
    consume(n: number): void
}

export function growableBuffer(size: number = 4096): GrowableBuffer {
    let data = new Uint8Array(size)
    let len = 0
    let readOffset = 0

    return {
        /* TODO: This needs a review */
        append(chunk) {
            const unread = len - readOffset
            const required = unread + chunk.length

            if (required > data.length) {
                let newSize = data.length * 2
                while (newSize < required) newSize *= 2

                const grown = new Uint8Array(newSize)
                grown.set(data.subarray(readOffset, len))

                data = grown
                len = unread
                readOffset = 0
            } else if (readOffset > 0) {
                data.copyWithin(0, readOffset, len)
                len = unread
                readOffset = 0
            }

            data.set(chunk, len)
            len += chunk.length
        },

        get available() {
            return len - readOffset
        },

        byteAt(i) {
            if (i < 0 || i >= this.available) throw new RangeError('index out of bounds')

            return data[readOffset + i]!
        },

        view() {
            return new DataView(data.buffer, data.byteOffset + readOffset, this.available)
        },

        slice(start, end) {
            if (start < 0 || end > this.available) throw new RangeError('index out of bounds')

            return data.slice(readOffset + start, readOffset + end)
        },

        consume(n) {
            if (n < 0 || n > this.available) throw new RangeError('index out of bounds')

            if (n === 0) return

            readOffset += n
        }
    }
}
