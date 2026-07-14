import { StreamClosedError } from './StreamClosedError'

export class StreamWriter<T> implements AsyncIterable<T> {
    private readonly queue: T[] = []
    private readonly waiting: ((result: IteratorResult<T>) => void)[] = []

    private closed = false

    yield(value: T): void {
        if (this.closed) {
            throw new StreamClosedError()
        }

        const waiter = this.waiting.shift()

        if (waiter) {
            waiter({
                done: false,
                value
            })
        } else {
            this.queue.push(value)
        }
    }

    close(): void {
        if (this.closed) return

        this.closed = true

        while (this.waiting.length) {
            this.waiting.shift()!({
                done: true,
                value: undefined
            })
        }
    }

    private async next(): Promise<IteratorResult<T>> {
        if (this.queue.length > 0) {
            return {
                done: false,
                value: this.queue.shift()!
            }
        }

        if (this.closed) {
            return {
                done: true,
                value: undefined
            }
        }

        return new Promise(resolve => {
            this.waiting.push(resolve)
        })
    }

    [Symbol.asyncIterator](): AsyncIterator<T> {
        return {
            next: () => this.next()
        }
    }
}
