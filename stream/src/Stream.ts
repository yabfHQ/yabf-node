import { NoMessageError } from './NoMessageError'
import { StreamConsumedError } from './StreamConsumedError'
import { StreamWriter } from './writer'

export class Stream<T> implements AsyncIterable<T> {
    private consumed: boolean = false
    private taps: ((message: T) => void | Promise<void>)[] = []

    constructor(private readonly messages: AsyncIterable<T>) {}

    static from<T>(iterator: () => AsyncIterator<T>) {
        return new Stream({
            [Symbol.asyncIterator]() {
                return iterator()
            }
        })
    }

    static create<T>(): { stream: Stream<T>; writer: StreamWriter<T> } {
        const writer = new StreamWriter<T>()
        const stream = new Stream(writer)

        return { stream, writer }
    }

    private consume(): AsyncIterator<T> {
        if (this.consumed) throw new StreamConsumedError()
        this.consumed = true

        const self = this

        const tapped: AsyncIterable<T> = {
            async *[Symbol.asyncIterator]() {
                for await (const message of self.messages) {
                    for (const tap of self.taps) {
                        await tap(message)
                    }

                    yield message
                }
            }
        }

        return tapped[Symbol.asyncIterator]()
    }

    [Symbol.asyncIterator](): AsyncIterator<T> {
        return this.consume()
    }

    async first(): Promise<T> {
        const { value, done } = await this.consume().next()
        if (done) throw new NoMessageError()

        return value
    }

    tap(fn: (message: T) => void | Promise<void>): Stream<T> {
        if (this.consumed) {
            throw new StreamConsumedError('Attempting to tap an already consumed stream')
        }

        this.taps.push(fn)
        return this
    }

    map<R>(fn: (message: T) => R | Promise<R>): Stream<R> {
        const self = this

        return Stream.from<R>(async function* () {
            for await (const message of self) {
                yield await fn(message)
            }
        })
    }

    filter(fn: (message: T) => boolean | Promise<boolean>): Stream<T> {
        const self = this

        return Stream.from<T>(async function* () {
            for await (const message of self) {
                if (await fn(message)) {
                    yield message
                }
            }
        })
    }
}
