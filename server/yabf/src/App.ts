import { AnyService } from '@yabf/contracts'
import { createDispatcher, Dispatcher } from '@yabf/dispatcher'
import { creatExecutor, Executor } from '@yabf/executor'
import { ServiceImpl } from '@yabf/inference'
import { Interceptor } from '@yabf/interceptors'
import { createRegistry, Registry } from '@yabf/registry'
import { MediaTypes, Serializer } from '@yabf/serialization'

export interface App {
    use(interceptor: Interceptor): void
    use(serializer: Serializer<string, MediaTypes>): void
    service<T extends AnyService>(service: T, implementation: ServiceImpl<T>): void
    dispatcher(): Dispatcher
}

export function createApp(): App {
    const registry: Registry = createRegistry()
    const executor: Executor = creatExecutor()
    const serializers: Serializer<string, MediaTypes>[] = []

    return {
        use(arg) {
            if (typeof arg === 'function') executor.use(arg)
            else serializers.push(arg)
        },

        service(service, implementation) {
            registry.service(service, implementation)
        },

        dispatcher() {
            return createDispatcher(registry, executor, serializers)
        }
    }
}
