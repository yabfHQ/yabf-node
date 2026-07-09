import { ZodType } from 'zod'
import { Cardinality } from './Cardinality'

export interface Message<T> {
    cardinality: Cardinality
    schema: ZodType<T>
}
