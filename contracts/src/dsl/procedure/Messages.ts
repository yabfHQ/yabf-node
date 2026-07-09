import { ZodType } from 'zod'
import { AnyMessage, Cardinality } from '../../definitions'

function _message<const T extends AnyMessage>(message: T): T {
    return message
}

export function message<T>(schema: ZodType<T>) {
    return _message({
        cardinality: Cardinality.ONE,
        schema
    })
}

export function messages<T>(schema: ZodType<T>) {
    return _message({
        cardinality: Cardinality.MANY,
        schema
    })
}
