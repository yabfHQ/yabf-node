import { AnyService, Cardinality } from '@yabf/contracts'
import { ServiceImpl } from '@yabf/inference'
import { Entry } from './Entry'
import { createHandler } from './Handler'

export interface Registry {
    service<T extends AnyService>(service: T, impl: ServiceImpl<T>): void

    lookup(service: string, procedure: string): Entry | null
    entries(): Iterable<[string, Entry]>
}

export function registry(): Registry {
    const entries = new Map<string, Entry>()

    const lookupKey = (service: string, procedure: string) => `${service}.${procedure}`

    return {
        service(service, implementation) {
            for (const [name, procedure] of Object.entries(service.procedures)) {
                const impl = implementation[name]!
                const handler = createHandler(procedure, impl)

                entries.set(lookupKey(service.name, name), {
                    service: service.name,
                    input: {
                        streaming: procedure.input.cardinality === Cardinality.MANY,
                        schema: procedure.input.schema
                    },
                    output: {
                        streaming: procedure.output.cardinality === Cardinality.MANY,
                        schema: procedure.output.schema
                    },
                    procedure: name,
                    handler
                })
            }
        },

        lookup(service: string, procedure: string) {
            return entries.get(lookupKey(service, procedure)) ?? null
        },

        entries() {
            return entries.entries()
        }
    }
}
