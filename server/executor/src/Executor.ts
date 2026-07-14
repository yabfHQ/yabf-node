import { Interceptor } from '@yabf/interceptors'
import { CallContext } from '@yabf/server-call'

export interface Executor {
    use(interceptor: Interceptor): void
    execute(context: CallContext, fn: () => Promise<void>): Promise<void>
}

export function executor(): Executor {
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

                await interceptor(context, () => chain(index + 1))
            }

            chain(0)
        }
    }
}
