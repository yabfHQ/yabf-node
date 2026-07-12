import { z } from 'zod'

export interface Entry {
    service: string
    procedure: string
    schemas: {
        I: z.ZodType<any>
        O: z.ZodType<any>
    }
    handler: (...args: any[]) => any
}
