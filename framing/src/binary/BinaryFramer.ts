import { FrameTagPosition } from '../FrameTagPosition'
import { Framer } from '../Framer'
import { InvalidFrameTagError, TruncatedFrameError } from '../errors'
import { FrameSizeExceededError } from '../errors/FrameSizeExceededError'
import { BinaryFramerConfig } from './BinaryFramerConfig'
import { BinaryFrames } from './BinaryFrames'
import { growableBuffer } from './GrowableBuffer'

export interface BinaryFramer extends Framer {}

/* TODO: Default formatting looks ugly, add some sort of rule to fix this */
export function binaryFramer({
    maxFrameSize = 16 * 1024 * 1024
}: Partial<BinaryFramerConfig> = {}): BinaryFramer {
    return {
        async *encode(messages) {
            for await (const payload of messages) {
                const payloadSize = payload.length ?? 0
                const frameSize = BinaryFrames.frameSize(payloadSize)
                if (frameSize > maxFrameSize) frameSizeError(frameSize, maxFrameSize)

                const frame = new Uint8Array(frameSize)
                const view = new DataView(frame.buffer)

                view.setUint8(BinaryFrames.Header.START_TAG_OFFSET, BinaryFrames.Tags.START)
                view.setUint32(BinaryFrames.Header.LENGTH_OFFSET, payloadSize)

                frame.set(payload, BinaryFrames.PAYLOAD_OFFSET)

                view.setUint8(BinaryFrames.tailOffset(payloadSize), BinaryFrames.Tags.END)

                yield frame
            }
        },

        async *decode(input) {
            const buf = growableBuffer()

            for await (const chunk of input) {
                buf.append(chunk)

                while (true) {
                    if (buf.available < BinaryFrames.TAG_SIZE) break

                    const tag = buf.byteAt(0)

                    if (tag !== BinaryFrames.Tags.START) tagError(tag, FrameTagPosition.START)

                    if (buf.available < BinaryFrames.Header.SIZE) break

                    const payloadSize = buf.view().getUint32(BinaryFrames.Header.LENGTH_OFFSET)
                    const frameSize = BinaryFrames.frameSize(payloadSize)
                    if (frameSize > maxFrameSize) frameSizeError(frameSize, maxFrameSize)

                    if (buf.available < frameSize) break

                    const tailOffset = BinaryFrames.tailOffset(payloadSize)
                    const endTag = buf.byteAt(tailOffset)
                    if (endTag !== BinaryFrames.Tags.END) tagError(endTag, FrameTagPosition.END)

                    const payload = buf.slice(BinaryFrames.PAYLOAD_OFFSET, tailOffset)

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
        position === FrameTagPosition.START ? BinaryFrames.Tags.START : BinaryFrames.Tags.END

    throw new InvalidFrameTagError(stringify(expected), stringify(tag), position)
}

function frameSizeError(frameSize: number, maxFrameSize: number): never {
    function stringify(size: number) {
        return `${size} bytes`
    }

    throw new FrameSizeExceededError(stringify(maxFrameSize), stringify(frameSize))
}
