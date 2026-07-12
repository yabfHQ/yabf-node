import { Entry } from './Entry'

export interface Registry {
    get(service: string, procedure: string): Entry | null
    set(entry: Entry): void
    entries(): Iterable<Entry>
}

export function registry(): Registry {
    const entries = new Map<string, Entry>()

    return {
        get(service: string, procedure: string) {
            return entries.get(`${service}.${procedure}`) ?? null
        },

        set(entry: Entry) {
            entries.set(`${entry.service}.${entry.procedure}`, entry)
        },

        entries() {
            return entries.values()
        }
    }
}
