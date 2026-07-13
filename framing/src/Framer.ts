import { Frame } from './frame'

export interface Framer {
    encode(frames: AsyncIterable<Frame>): AsyncIterable<Uint8Array>
    decode(input: AsyncIterable<Uint8Array>): AsyncIterable<Frame>
}
