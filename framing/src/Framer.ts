export interface Framer {
    encode(messages: AsyncIterable<Uint8Array>): AsyncIterable<Uint8Array>
    decode(input: AsyncIterable<Uint8Array>): AsyncIterable<Uint8Array>
}
