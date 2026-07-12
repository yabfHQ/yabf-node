import { z } from 'zod'

export interface Entry {
    service: string
    procedure: string
    input: {
        streaming: boolean
        schema: z.ZodType<any>
    }
    output: {
        streaming: boolean
        schema: z.ZodType<any>
    }
    handler: (...args: any[]) => any
}
