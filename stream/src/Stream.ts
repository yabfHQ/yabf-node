import { NoMessageError } from './NoMessageError'
import { StreamConsumedError } from './StreamConsumedError'

export class Stream<T> implements AsyncIterable<T> {
    private consumed: boolean = false

    private constructor(private readonly messages: AsyncIterator<T>) {}

    static from<T>(iterator: () => AsyncIterator<T>) {
        return new Stream(iterator())
    }

    [Symbol.asyncIterator](): AsyncIterator<T> {
        if (this.consumed) throw new StreamConsumedError()
        this.consumed = true

        return this.messages
    }

    async first(): Promise<T> {
        for await (const message of this) {
            return message
        }

        throw new NoMessageError()
    }

    async forEach(fn: (message: T) => void | Promise<void>): Promise<void> {
        for await (const message of this) {
            await fn(message)
        }
    }

    tap(fn: (message: T) => void | Promise<void>): Stream<T> {
        const self = this

        return Stream.from(async function* () {
            for await (const message of self) {
                await fn(message)
                yield message
            }
        })
    }

    map<R>(fn: (message: T) => R | Promise<R>): Stream<R> {
        const self = this

        return Stream.from(async function* () {
            for await (const message of self) {
                yield await fn(message)
            }
        })
    }

    filter(fn: (message: T) => boolean | Promise<boolean>): Stream<T> {
        const self = this

        return Stream.from(async function* () {
            for await (const message of self) {
                if (await fn(message)) {
                    yield message
                }
            }
        })
    }
}
