import { FrameTagPosition } from '../FrameTagPosition'
import { Framer } from '../Framer'
import { IncompleteStreamError, InvalidFrameTagError } from '../errors'
import { BinaryFrame } from './BinaryFrame'
import { growableBuffer } from './GrowableBuffer'

export interface BinaryFramer extends Framer {}

export function binaryFramer(): BinaryFramer {
    return {
        async *encode(input) {
            for await (const chunk of input) {
                const payloadSize = chunk.length

                const frame = new Uint8Array(BinaryFrame.frameSize(payloadSize))
                const view = new DataView(frame.buffer)

                view.setUint8(BinaryFrame.Header.START_TAG_OFFSET, BinaryFrame.Tags.START)
                view.setUint32(BinaryFrame.Header.LENGTH_OFFSET, payloadSize)

                frame.set(chunk, BinaryFrame.PAYLOAD_OFFSET)

                view.setUint8(BinaryFrame.tailOffset(payloadSize), BinaryFrame.Tags.END)

                yield frame
            }

            yield new Uint8Array([BinaryFrame.Tags.STREAM_END])
        },

        async *decode(input) {
            const buf = growableBuffer()

            for await (const chunk of input) {
                buf.append(chunk)

                while (true) {
                    if (buf.available < BinaryFrame.TAG_SIZE) break

                    const tag = buf.byteAt(0)

                    if (tag === BinaryFrame.Tags.STREAM_END) {
                        buf.consume(1)
                        return
                    }

                    if (tag !== BinaryFrame.Tags.START) tagError(tag, FrameTagPosition.START)

                    if (buf.available < BinaryFrame.Header.SIZE) break

                    const payloadSize = buf.view().getUint32(BinaryFrame.Header.LENGTH_OFFSET)
                    const frameSize = BinaryFrame.frameSize(payloadSize)
                    if (buf.available < frameSize) break

                    const tailOffset = BinaryFrame.tailOffset(payloadSize)
                    const endTag = buf.byteAt(tailOffset)
                    if (endTag !== BinaryFrame.Tags.END) tagError(endTag, FrameTagPosition.END)

                    const payload = buf.slice(
                        BinaryFrame.PAYLOAD_OFFSET,
                        tailOffset
                    )

                    buf.consume(frameSize)
                    yield payload
                }
            }

            throw new IncompleteStreamError()
        }
    }
}

function tagError(tag: number, position: FrameTagPosition): never {
    function stringify(byte: number) {
        return `BIN(${byte.toString(16).padStart(2, '0')})`
    }

    const expected =
        position === FrameTagPosition.START ? BinaryFrame.Tags.START : BinaryFrame.Tags.END

    throw new InvalidFrameTagError(stringify(expected), stringify(tag), position)
}
