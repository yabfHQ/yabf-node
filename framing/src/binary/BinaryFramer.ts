import { FrameTagPosition } from '../FrameTagPosition'
import { Framer } from '../Framer'
import { InvalidFrameTagError, TruncatedFrameError } from '../errors'
import { FrameSizeExceededError } from '../errors/FrameSizeExceededError'
import { BinaryFrame } from './BinaryFrame'
import { BinaryFramerConfig } from './BinaryFramerConfig'
import { growableBuffer } from './GrowableBuffer'

export interface BinaryFramer extends Framer {}

/* TODO: Default formatting looks ugly, add some sort of rule to fix this */
export function binaryFramer({
    maxFrameSize = 16 * 1024 * 1024
}: Partial<BinaryFramerConfig> = {}): BinaryFramer {
    return {
        async *encode(input) {
            for await (const chunk of input) {
                const payloadSize = chunk.length
                if (payloadSize > maxFrameSize) frameSizeError(payloadSize, maxFrameSize)

                const frame = new Uint8Array(BinaryFrame.frameSize(payloadSize))
                const view = new DataView(frame.buffer)

                view.setUint8(BinaryFrame.Header.START_TAG_OFFSET, BinaryFrame.Tags.START)
                view.setUint32(BinaryFrame.Header.LENGTH_OFFSET, payloadSize)

                frame.set(chunk, BinaryFrame.PAYLOAD_OFFSET)

                view.setUint8(BinaryFrame.tailOffset(payloadSize), BinaryFrame.Tags.END)

                yield frame
            }
        },

        async *decode(input) {
            const buf = growableBuffer()

            for await (const chunk of input) {
                buf.append(chunk)

                while (true) {
                    if (buf.available < BinaryFrame.TAG_SIZE) break

                    const tag = buf.byteAt(0)

                    if (tag !== BinaryFrame.Tags.START) tagError(tag, FrameTagPosition.START)

                    if (buf.available < BinaryFrame.Header.SIZE) break

                    const payloadSize = buf.view().getUint32(BinaryFrame.Header.LENGTH_OFFSET)
                    if (payloadSize > maxFrameSize) frameSizeError(payloadSize, maxFrameSize)

                    const frameSize = BinaryFrame.frameSize(payloadSize)
                    if (buf.available < frameSize) break

                    const tailOffset = BinaryFrame.tailOffset(payloadSize)
                    const endTag = buf.byteAt(tailOffset)
                    if (endTag !== BinaryFrame.Tags.END) tagError(endTag, FrameTagPosition.END)

                    const payload = buf.slice(BinaryFrame.PAYLOAD_OFFSET, tailOffset)

                    buf.consume(frameSize)
                    yield payload
                }
            }

            if (buf.available > 0) {
                throw new TruncatedFrameError()
            }
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

function frameSizeError(frameSize: number, maxFrameSize: number): never {
    function stringify(size: number) {
        return `${size} bytes`
    }

    throw new FrameSizeExceededError(stringify(maxFrameSize), stringify(frameSize))
}
