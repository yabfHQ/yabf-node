import { FrameTagPosition } from '../FrameTagPosition'
import { Framer } from '../Framer'
import { IncompleteStreamError } from '../errors'
import { BinaryFrameTags } from './BinaryFrameTags'
import { growableBuffer } from './GrowableBuffer'
import { invalidFrameTagError } from './errors/InvalidFrameTagError'

export interface BinaryFramer extends Framer {}

const TAG_SIZE = 1
const PAYLOAD_LENGTH_SIZE = 4
const HEADER_SIZE = TAG_SIZE + PAYLOAD_LENGTH_SIZE

export function binaryFramer(): BinaryFramer {
    return {
        async *encode(input) {
            function createHeader(size: number) {
                const header = new Uint8Array(HEADER_SIZE)
                const headerDataView = new DataView(header.buffer)

                headerDataView.setUint8(0, BinaryFrameTags.START)
                headerDataView.setUint32(TAG_SIZE, size, false)

                return header
            }

            for await (const chunk of input) {
                const payloadSize = chunk.length
                const header = createHeader(payloadSize)

                const frame = new Uint8Array(HEADER_SIZE + payloadSize + TAG_SIZE)
                frame.set(header, 0)
                frame.set(chunk, HEADER_SIZE)

                frame.set([BinaryFrameTags.END], HEADER_SIZE + payloadSize)

                yield frame
            }

            yield new Uint8Array([BinaryFrameTags.STREAM_END])
        },

        async *decode(input) {
            const buf = growableBuffer()

            for await (const chunk of input) {
                buf.append(chunk)

                while (true) {
                    if (buf.available < TAG_SIZE) break

                    const tag = buf.byteAt(0)

                    if (tag === BinaryFrameTags.STREAM_END) {
                        buf.consume(1)
                        return
                    }

                    if (tag !== BinaryFrameTags.START) {
                        invalidFrameTagError(tag, FrameTagPosition.START)
                    }

                    if (buf.available < HEADER_SIZE) break

                    const payloadSize = buf.view().getUint32(TAG_SIZE, false)
                    const frameSize = HEADER_SIZE + payloadSize + TAG_SIZE
                    if (buf.available < frameSize) break

                    const payload = buf.slice(HEADER_SIZE, HEADER_SIZE + payloadSize)
                    const endTag = buf.byteAt(HEADER_SIZE + payloadSize)

                    if (endTag !== BinaryFrameTags.END) {
                        invalidFrameTagError(endTag, FrameTagPosition.END)
                    }

                    buf.consume(frameSize)
                    yield payload
                }
            }

            throw new IncompleteStreamError()
        }
    }
}
