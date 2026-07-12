import { MessagesConsumedError } from './MessagesConsumedError'
import { NoMessageError } from './NoMessageError'

export class Messages<T> implements AsyncIterable<T> {
    private consumed: boolean = false

    private constructor(private readonly messages: AsyncIterator<T>) {}

    static from<T>(iterator: () => AsyncIterator<T>) {
        return new Messages(typeof iterator === 'function' ? iterator() : iterator)
    }

    [Symbol.asyncIterator](): AsyncIterator<T> {
        if (this.consumed) throw new MessagesConsumedError()
        this.consumed = true

        return this.messages
    }

    async single(): Promise<T> {
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

    tap(fn: (message: T) => void | Promise<void>): Messages<T> {
        const self = this

        return Messages.from(async function* () {
            for await (const message of self) {
                await fn(message)
                yield message
            }
        })
    }

    map<R>(fn: (message: T) => R | Promise<R>): Messages<R> {
        const self = this

        return Messages.from(async function* () {
            for await (const message of self) {
                yield await fn(message)
            }
        })
    }

    filter(fn: (message: T) => boolean | Promise<boolean>): Messages<T> {
        const self = this

        return Messages.from(async function* () {
            for await (const message of self) {
                if (await fn(message)) {
                    yield message
                }
            }
        })
    }
}
