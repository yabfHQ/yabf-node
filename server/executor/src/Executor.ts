import { Interceptor } from '@yabf/interceptors'
import { CallContext } from '@yabf/server-call'

export interface Executor {
    use(interceptor: Interceptor): void
    execute(context: CallContext, fn: () => Promise<void>): Promise<void>
}

export function creatExecutor(): Executor {
    const interceptors: Interceptor[] = []

    return {
        use(interceptor: Interceptor) {
            interceptors.push(interceptor)
        },

        async execute(context, fn) {
            async function chain(index: number): Promise<void> {
                if (index === interceptors.length) {
                    await fn()
                    return
                }

                const interceptor = interceptors[index]!

                let downStream: Promise<void> | undefined
                await interceptor(context, () => {
                    downStream ??= chain(index + 1)
                    return  downStream
                })

                await downStream
            }

            await chain(0)
        }
    }
}
