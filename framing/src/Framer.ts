export interface Framer {
    encode(input: AsyncIterable<Uint8Array>): AsyncIterable<Uint8Array>
    decode(input: AsyncIterable<Uint8Array>): AsyncIterable<Uint8Array>
}
